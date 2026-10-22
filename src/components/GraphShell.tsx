import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { copy } from '../types/portfolio';
import { ui } from '../data/portfolio';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { GraphFallback } from './GraphFallback';
import { countRender, debugEnabled } from '../debug/telemetry';
import { DebugOverlay } from '../debug/DebugOverlay';
import { ConstellationControls } from './ConstellationControls';

const KnowledgeGraph = lazy(() => import('../scenes/KnowledgeGraph'));

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.warn('3D view unavailable; using accessible text view.', error.message, info.componentStack); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function GraphShell() {
  countRender('GraphShell');
  const mobile = useMediaQuery('(max-width: 760px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const textView = usePortfolioStore(state => state.textView);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [expanded,setExpanded]=useState(false);
  const failure = useCallback(() => setSupported(false), []);
  useEffect(() => {
    if (reducedMotion || textView) return;
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      setSupported(Boolean(context));
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { setSupported(false); }
  }, [reducedMotion, textView]);
  const fallback = reducedMotion || textView || supported === false;
  useEffect(()=>{if(fallback)setExpanded(false);},[fallback]);
  useEffect(()=>{
    if(!expanded)return;
    const prior=document.body.style.overflow;const previous=document.activeElement as HTMLElement|null;
    document.body.style.overflow='hidden';
    const handle=(event:KeyboardEvent)=>{
      if(document.querySelector('dialog[open]'))return;
      if(event.key==='Escape'){setExpanded(false);return;}
      if(event.key!=='Tab')return;
      const buttons=[...document.querySelectorAll<HTMLElement>('.graph-shell.is-expanded button, .graph-shell.is-expanded a')].filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
      const first=buttons[0],last=buttons.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    };
    window.addEventListener('keydown',handle);
    return()=>{document.body.style.overflow=prior;window.removeEventListener('keydown',handle);previous?.focus({preventScroll:true});};
  },[expanded]);
  return <div className={`graph-shell constellation-shell ${expanded?'is-expanded':''}`} role={expanded?'dialog':'region'} aria-modal={expanded||undefined} aria-label={copy(ui.graphRegionLabel)}>
    {debugEnabled && <DebugOverlay />}
    <div className="graph-grid" aria-hidden="true" />
    <div className="canvas-container" data-lenis-prevent aria-label="Interactive 3D network. Drag to rotate and flip, scroll to zoom, right-drag to pan. On touch screens, drag to rotate and pinch to zoom.">
      {fallback ? <GraphFallback /> : supported === null ? <div className="scene-loading">{copy(ui.loading)}</div> :
        <SceneBoundary fallback={<GraphFallback />}>
          <Suspense fallback={<div className="scene-loading">{copy(ui.loading)}</div>}>
            <KnowledgeGraph mobile={mobile} onFailure={failure} />
          </Suspense>
        </SceneBoundary>}
    </div>
    {!fallback&&<ConstellationControls expanded={expanded} toggleExpanded={()=>setExpanded(value=>!value)}/>}
    <span className="graph-coordinate graph-coordinate-bottom" aria-hidden="true">{copy(ui.graphHint)}</span>
  </div>;
}
