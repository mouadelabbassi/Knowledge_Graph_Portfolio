import { edges, nodes, entries, skills } from '../src/data/portfolio.ts';
import { matchQuestion } from '../src/graph/intentMatcher.ts';
const ids = new Set(nodes.map(n => n.id));
console.log('Unresolved edges:', edges.filter(e => !ids.has(e.source) || !ids.has(e.target)));
console.log('Counts:', { projects: entries.filter(n => n.kind === 'project').length, research: entries.filter(n => n.kind === 'research').length, certifications: entries.filter(n => n.kind === 'certification').length, volunteering: entries.filter(n => n.kind === 'volunteering').length, skills: skills.length });
for (const question of ['Which projects used reinforcement learning?', 'Show me his RAG work', 'Show Darija RAG', 'RAG with LangChain', 'Show me his research', 'Where did he volunteer?', 'JavaFX', 'MouadVision', 'RAG at Leyton']) console.log(question, matchQuestion(question).nodeIds);
