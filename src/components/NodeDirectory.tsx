import { clusters, nodes, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function NodeDirectory() {
  const select = usePortfolioStore(state => state.select);
  const paused = usePortfolioStore(state => state.paused);
  const textView = usePortfolioStore(state => state.textView);
  const togglePaused = usePortfolioStore(state => state.togglePaused);
  const toggleTextView = usePortfolioStore(state => state.toggleTextView);
  const resetCamera = usePortfolioStore(state => state.resetCamera);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  return <div className="graph-directory-wrap">
    <details className="node-directory" open={reducedMotion || textView || undefined}>
      <summary><span className="directory-symbol" aria-hidden="true">⌘</span>{copy(ui.directory)}<span className="directory-count">{nodes.length}</span><span className="directory-chevron" aria-hidden="true">+</span></summary>
      <div className="directory-content"><button className="directory-person" onClick={() => select('mouad')}>{nodes[0]!.label} ↗</button>{clusters.map(cluster => <div className="directory-group" key={cluster.id}>
        <button className="directory-group-title" onClick={() => select(cluster.id)}>{copy(cluster.label)}</button>
        <div>{nodes.filter(node => node.cluster === cluster.id && node.kind !== 'cluster').map(node => <button key={node.id} onClick={() => select(node.id)}>{node.label}</button>)}</div>
      </div>)}</div>
    </details>
    <div className="scene-controls">
      {!reducedMotion && !textView && <><button onClick={resetCamera}>{copy(ui.resetView)} <span aria-hidden="true">↺</span></button><button onClick={togglePaused} aria-pressed={paused}>{copy(paused ? ui.resume : ui.pause)}</button></>}
      {!reducedMotion && <button onClick={toggleTextView} aria-pressed={textView}>{copy(textView ? ui.switchToGraph : ui.switchToText)}</button>}
    </div>
  </div>;
}
