import { describe, expect, it } from 'vitest';
import { edges, entries, nodeById, nodes } from '../data/portfolio';
import { evidenceCount, focusNodeIds, graphLenses, lensNodeIds, lensWork } from './presentation';
import { usePortfolioStore } from '../state/usePortfolioStore';

describe('constellation exploration',()=>{
  it('keeps all project and research entries in the complete constellation',()=>{
    expect(lensWork('all').map(n=>n.id)).toEqual(entries.filter(n=>n.kind==='project'||n.kind==='research').map(n=>n.id));
    expect(lensNodeIds('all').size).toBe(nodes.length);
    for(const lens of graphLenses)for(const id of lensNodeIds(lens.id))expect(nodeById.has(id)).toBe(true);
  });
  it('derives each field from the existing project category and its documented tools',()=>{
    for(const lens of ['ai','data','software'] as const){
      const work=lensWork(lens),ids=lensNodeIds(lens);
      expect(work.length).toBeGreaterThan(0);
      for(const item of work){expect(ids.has(item.id)).toBe(true);for(const tool of item.technologies)expect(ids.has(tool)).toBe(true);}
    }
    expect(lensNodeIds('software').has('grand-heaven')).toBe(true);
    expect(lensNodeIds('data').has('hadoop-movielens')).toBe(true);
    expect(lensNodeIds('ai').has('microgrid')).toBe(true);
  });
  it('only highlights existing neighbors and counts documented evidence',()=>{
    const focus=focusNodeIds('microgrid');
    expect(focus.has('ppo')).toBe(true);expect(focus.has('mysql')).toBe(false);
    expect(evidenceCount('microgrid')).toBe(edges.filter(e=>e.evidence==='provided'&&(e.source==='microgrid'||e.target==='microgrid')).length);
  });
  it('keeps graph focus separate from opening a project and resets the explorer',()=>{
    const store=usePortfolioStore.getState();store.setGraphLens('data');store.focusGraph('hadoop-movielens');
    expect(usePortfolioStore.getState().selectedId).toBeNull();
    expect(usePortfolioStore.getState().graphFocusId).toBe('hadoop-movielens');
    store.resetCamera();expect(usePortfolioStore.getState().graphLens).toBe('all');expect(usePortfolioStore.getState().graphFocusId).toBeNull();
  });
});
