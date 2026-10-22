import { describe, expect, it } from 'vitest';
import { edges, nodeById, queryIntents } from '../data/portfolio';
import { matchQuestion } from './intentMatcher';
import { usePortfolioStore } from '../state/usePortfolioStore';

describe('source-backed local Ask',()=>{
  it('finds the supplied RL and RAG work without inventing another project',()=>{
    expect(matchQuestion('Which projects used reinforcement learning?').nodeIds).toEqual(['microgrid','ppo','gymnasium','reinforcement-learning']);
    const rag=matchQuestion('Show me his RAG work');
    expect(rag.nodeIds).toEqual(['ensa-internship','ensakh-chatbot','chromadb','darija','langchain']);
    expect(rag.nodeIds).not.toContain('leyton');
  });
  it('respects named-work constraints and does not invent employer-specific RAG use',()=>{
    expect(matchQuestion('Show me Leyton RAG').status).toBe('unknown');
    expect(matchQuestion('Which RL project did he build at Leyton?').status).toBe('unknown');
    const darija=matchQuestion('Show Darija RAG');
    expect(darija.nodeIds).toEqual(['darija','langchain']);
    expect(darija.explanations.map(copy=>copy.en.text).join(' ')).not.toContain('ENSA');
    expect(matchQuestion('RAG with GraphRAG').status).toBe('unknown');
    expect(matchQuestion('RAG using Neo4j').status).toBe('unknown');
    expect(matchQuestion('RAG with LangChain').nodeIds).toEqual(['darija','langchain']);
    expect(matchQuestion('Microgrid using MySQL').status).toBe('unknown');
    expect(matchQuestion('Commerce using MySQL').nodeIds).toEqual(['commerce','mysql']);
    expect(matchQuestion('Which projects use reinforcement learning?').status).toBe('matched');
    expect(matchQuestion('Projects using reinforcement learning').status).toBe('matched');
  });
  it('uses token boundaries and keeps listed skills separate from proven project use',()=>{
    expect(matchQuestion('hello world hippo').status).toBe('unknown');
    const graph=matchQuestion('Where did he use GraphRAG?');
    expect(graph.nodeIds).toEqual(['graphrag']);
    expect(graph.edgeIds).toEqual([]);
    expect(graph.explanations.some(copy=>copy.en.text.includes('No project-specific use'))).toBe(true);
    expect(matchQuestion('Show his Neo4j work').status).toBe('unknown');
  });
  it('combines independent topics and maps named skills to documented work',()=>{
    expect(matchQuestion('RAG and PPO').nodeIds).toEqual(expect.arrayContaining(['microgrid','darija','ensa-internship']));
    const langchain=matchQuestion('Which projects used LangChain?');
    expect(langchain.nodeIds).toEqual(expect.arrayContaining(['langchain','microgrid','darija']));
  });
  it('generates only existing, documented edges and a bounded reasoning sequence',()=>{
    for(const intent of queryIntents) {
      const result=matchQuestion(intent.question.en.text);
      expect(result.status).toBe('matched');
      for(const id of result.nodeIds) expect(nodeById.has(id)).toBe(true);
      for(const id of result.edgeIds) expect(edges.find(edge=>edge.id===id)?.evidence).toBe('provided');
      for(const step of result.steps.filter(step=>step.kind==='relation')) expect(result.edgeIds).toContain(step.edgeId);
      expect(result.steps[0]?.kind).toBe('match');
      expect(result.steps.at(-1)?.kind).toBe('evidence');
    }
  });
  it('bounds replay, stops at its end, and cancels animation when switching to CV',()=>{
    const store=usePortfolioStore.getState();
    store.ask('Which projects used RL?');store.startReplay(true);
    for(let i=0;i<30;i++) usePortfolioStore.getState().stepReplay(1);
    let state=usePortfolioStore.getState();
    expect(state.replayRunning).toBe(false);
    expect(state.replayIndex).toBe(state.queryResult!.steps.length-1);
    state.continueReplay();state.toggleRecruiterMode();
    state=usePortfolioStore.getState();
    expect(state.recruiterMode).toBe(true);
    expect(state.replayRunning).toBe(false);
    expect(state.askFocused).toBe(false);
    state.toggleRecruiterMode();state.clearQuery();
  });
});
