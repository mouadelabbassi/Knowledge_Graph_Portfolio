import { edges, nodeById } from '../data/portfolio';
import type { PortfolioEdge, PortfolioNode } from '../types/portfolio';

export function connectionsFor(id: string): { edge: PortfolioEdge; node: PortfolioNode }[] {
  return edges
    .filter(edge => edge.evidence === 'provided' && (edge.source === id || edge.target === id))
    .map(edge => ({ edge, node: nodeById.get(edge.source === id ? edge.target : edge.source)! }));
}

export function highlightedIds(id: string | null): Set<string> {
  if (!id) return new Set();
  const result = new Set([id]);
  for (const edge of edges) {
    if (edge.source === id) result.add(edge.target);
    if (edge.target === id) result.add(edge.source);
  }
  return result;
}
