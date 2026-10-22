import { edges, entries, nodeById, nodes, queryIntents, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import type { QueryResult, ReasoningStep } from '../types/query';

export function normalizeQuestion(text: string): string {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}
const contains = (question: string, phrase: string) => ` ${question} `.includes(` ${normalizeQuestion(phrase)} `);
const unique = <T,>(values: T[]): T[] => [...new Set(values)];
export const fillCopy = (template: string, values: Record<string, string>): string => template.replace(/\{(\w+)\}/g, (match: string, key: string) => values[key] ?? match);

export function matchQuestion(question: string): QueryResult {
  const normalized = normalizeQuestion(question.slice(0, 500));
  const unknown: QueryResult = { status: 'unknown', question: question.slice(0,500), matchedTerms: [], nodeIds: [], edgeIds: [], explanations: [], query: '', steps: [] };
  if (!normalized) return unknown;
  const requestedTools = nodes.filter(node=>['skill','technology'].includes(node.kind) && [node.label,node.shortLabel,...(node.nameAliases??[])].some(alias=>contains(normalized,alias)));
  const restricted = /\b(with|using|via)\b/.test(normalized);
  const namedWork = entries.filter(node => ['project','experience','research','volunteering'].includes(node.kind) && [node.label,node.shortLabel,...(node.nameAliases ?? [])].some(alias=>contains(normalized,alias)));
  const intents = queryIntents.map(intent=>({intent, terms:intent.aliases.filter(alias=>contains(normalized,alias))})).filter(match=>match.terms.length);
  const restrictionTail=normalized.split(/\b(?:with|using|via)\b/).slice(1).join(' ');
  if(restricted && !requestedTools.length && !intents.some(match=>match.intent.aliases.some(alias=>contains(restrictionTail,alias)))) return unknown;
  if (intents.length) {
    let ids = unique(intents.flatMap(match=>match.intent.nodes));
    let explanations = intents.map(match=>match.intent.explanation);
    // A named employer/project is a constraint, not permission to invent use.
    if (namedWork.length) {
      const supported = namedWork.filter(node=>ids.includes(node.id));
      if (!supported.length) return unknown;
      const allowed = new Set(supported.flatMap(node=>[node.id,...node.technologies]));
      ids = ids.filter(id=>allowed.has(id));
      explanations = supported.flatMap(node=>{
        const relevant = node.details.filter(detail=>intents.some(match=>match.intent.aliases.some(alias=>contains(normalizeQuestion(copy(detail)),alias))));
        return relevant.length ? relevant : [node.summary];
      });
    }
    if (requestedTools.length && (intents.length===1 || restricted)) {
      const toolIds=requestedTools.map(node=>node.id);
      const work=entries.filter(node=>ids.includes(node.id) && toolIds.every(id=>node.technologies.includes(id)) && (!restricted || intents.every(match=>match.intent.nodes.includes(node.id))));
      if (!work.length) return unknown;
      const allowed=new Set(work.flatMap(node=>[node.id,...node.technologies]));
      ids=unique([...ids.filter(id=>allowed.has(id)),...toolIds]);
      explanations=work.flatMap(node=>{
        const relevant=node.details.filter(detail=>intents.some(match=>match.intent.aliases.some(alias=>contains(normalizeQuestion(copy(detail)),alias))) || requestedTools.some(tool=>contains(normalizeQuestion(copy(detail)),tool.label)));
        return relevant.length ? relevant : [node.summary];
      });
    }
    const terms = unique(intents.flatMap(match=>match.terms));
    const selectedIntents = intents.filter(match=>match.intent.nodes.some(id=>ids.includes(id)));
    return finish({ ...unknown, status:'matched', nodeIds:ids, matchedTerms:terms,
      explanations, query: namedWork.length || requestedTools.length ? `MATCH (n) WHERE n.id IN [${ids.map(id=>`'${id}'`).join(', ')}]\nOPTIONAL MATCH (n)-[r]-(related) WHERE related.id IN [${ids.map(id=>`'${id}'`).join(', ')}]\nRETURN n, r, related` : selectedIntents.map(match=>match.intent.query).join('\nUNION\n') });
  }
  if(namedWork.length && requestedTools.length) {
    const supported=namedWork.filter(node=>requestedTools.every(tool=>node.technologies.includes(tool.id)));
    if(!supported.length) return unknown;
    const ids=unique([...supported.map(node=>node.id),...requestedTools.map(node=>node.id)]);
    const explanations=supported.flatMap(node=>node.details.filter(detail=>requestedTools.some(tool=>contains(normalizeQuestion(copy(detail)),tool.label))));
    return finish({...unknown,status:'matched',nodeIds:ids,matchedTerms:requestedTools.map(node=>node.label),explanations:explanations.length ? explanations : supported.map(node=>node.summary),query:`MATCH (n)-[r]-(related) WHERE n.id IN [${ids.map(id=>`'${id}'`).join(', ')}] AND related.id IN [${ids.map(id=>`'${id}'`).join(', ')}] RETURN n, r, related`});
  }
  const candidates = nodes.filter(node=>!['cluster','person'].includes(node.kind)).map(node=>({node, terms:unique([node.label,node.shortLabel,...node.aliases,...(node.nameAliases ?? [])]).filter(alias=>contains(normalized,alias))})).filter(match=>match.terms.length);
  if (!candidates.length) return unknown;
  const mostSpecific = Math.max(...candidates.map(match=>Math.max(...match.terms.map(term=>normalizeQuestion(term).length))));
  const matched = candidates.filter(match=>match.terms.some(term=>normalizeQuestion(term).length===mostSpecific));
  const directIds = matched.map(match=>match.node.id);
  const connectedWork = edges.filter(edge=>edge.evidence==='provided' && directIds.includes(edge.target) && ['experience','project','research','volunteering'].includes(nodeById.get(edge.source)!.kind)).map(edge=>edge.source);
  const tags = matched.flatMap(match=>match.node.technologies);
  const ids = unique([...directIds,...connectedWork,...tags]);
  const explanations = matched.map(match=>match.node.summary);
  if (matched.every(match=>match.node.kind==='skill') && !connectedWork.length) explanations.push(ui.noConnections);
  else if (connectedWork.length) explanations.push(ui.askRelatedEvidence);
  // Only trusted, predefined node IDs enter the query preview.
  return finish({ ...unknown,status:'matched',nodeIds:ids,matchedTerms:unique(matched.flatMap(match=>match.terms)),explanations,
    query:`MATCH (n) WHERE n.id IN [${ids.map(id=>`'${id}'`).join(', ')}]\nOPTIONAL MATCH (n)-[r:USED|BUILT_WITH|TRAINED|VALIDATED_WITH]-(related)\nRETURN n, r, related` });
}

function finish(result: QueryResult): QueryResult {
  const ids = new Set(result.nodeIds);
  const evidenceEdges = edges.filter(edge=>edge.evidence==='provided' && ids.has(edge.source) && ids.has(edge.target));
  const steps: ReasoningStep[] = [{ id:'match',kind:'match',text:fillCopy(copy(ui.askMatchStep),{terms:result.matchedTerms.join(', ')}) }];
  for (const edge of evidenceEdges) steps.push({ id:edge.id,kind:'relation',edgeId:edge.id,sourceId:edge.source,targetId:edge.target,
    text:`${nodeById.get(edge.source)!.shortLabel} → ${edge.relation} → ${nodeById.get(edge.target)!.shortLabel}` });
  const work = result.nodeIds.map(id=>nodeById.get(id)!).filter(node=>['project','experience','research','volunteering'].includes(node.kind));
  const evidenceNodes = work.length ? work : result.nodeIds.slice(0,1).map(id=>nodeById.get(id)!);
  for (const node of evidenceNodes) steps.push({id:`evidence:${node.id}`,kind:'evidence',sourceId:node.id,text:fillCopy(copy(ui.askEvidenceStep),{node:node.shortLabel})+' '+copy(node.details[0]??node.summary)});
  return { ...result,edgeIds:evidenceEdges.map(edge=>edge.id),steps };
}
