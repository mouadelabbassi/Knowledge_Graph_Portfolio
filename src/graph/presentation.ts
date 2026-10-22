import { edges, entries, nodeById, nodes } from '../data/portfolio.ts';
export type GraphLens = 'all' | 'ai' | 'data' | 'software';
export const graphLenses: {id:GraphLens;label:string;description:string;color:string}[] = [
  {id:'all',label:'All connections',description:'A constellation of projects, skills, and the experiences behind them.',color:'#2cc6af'},
  {id:'ai',label:'AI & language',description:'From Darija language models to explainable energy decisions.',color:'#f6b85b'},
  {id:'data',label:'Data & insight',description:'Follow the path from raw records to useful decisions.',color:'#78b6d2'},
  {id:'software',label:'Software & systems',description:'The applications and infrastructure that turn ideas into products.',color:'#a997e8'},
];
const categories = {ai:'AI & language',data:'Data & analytics',software:'Software & systems'} as const;
export function lensWork(lens:GraphLens) {
  return entries.filter(node => node.kind==='project'||node.kind==='research').filter(node => lens==='all'||node.category===categories[lens]);
}
export function lensNodeIds(lens:GraphLens):Set<string> {
  if(lens==='all')return new Set(nodes.map(node=>node.id));
  return new Set(['mouad','projects',...lensWork(lens).flatMap(node=>[node.id,...node.technologies])]);
}
export function focusNodeIds(id:string):Set<string> {
  const node=nodeById.get(id);
  const ids=new Set([id]);
  for(const edge of edges){if(edge.source===id)ids.add(edge.target);if(edge.target===id)ids.add(edge.source);}
  if(node?.kind==='cluster') ids.add('mouad');
  return ids;
}
export function evidenceCount(id:string):number {
  return edges.filter(edge=>edge.evidence==='provided'&&(edge.source===id||edge.target===id)).length;
}
