import { clusters, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { GraphMark } from './Icons';

export function GraphFallback() {
  const select = usePortfolioStore(state => state.select);
  return <div className="graph-fallback">
    <GraphMark />
    <p>{copy(ui.fallback)}</p>
    <div className="fallback-clusters">{clusters.map(cluster => <button key={cluster.id} onClick={() => select(cluster.id)}>{copy(cluster.label)} <span aria-hidden="true">↗</span></button>)}</div>
    <span>{copy(ui.fallbackDetail)}</span>
  </div>;
}
