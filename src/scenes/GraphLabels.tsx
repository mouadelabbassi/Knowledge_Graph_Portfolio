import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Matrix4, Vector3 } from 'three';
import { clusters, nodes, profile } from '../data/portfolio';
import { lensWork } from '../graph/presentation';
import { copy } from '../types/portfolio';
import type { Position } from '../graph/layout';
import type { FloatingGraph } from '../graph/motion';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { countRender, debugEnabled, recordWork, telemetry } from '../debug/telemetry';
import { useMediaQuery } from '../hooks/useMediaQuery';

export interface LabelRegistry { elements: Map<string, HTMLDivElement>; revision: number }

export function GraphProjection({ positions, registry, graph }: { positions: Map<string, Position>; registry: LabelRegistry; graph: FloatingGraph }) {
  const { camera, size } = useThree();
  const vector = useMemo(() => new Vector3(), []);
  const prior = useMemo(() => ({ world: new Matrix4(), projection: new Matrix4(), width: 0, height: 0, revision: -1 }), []);
  const styles = useRef(new WeakMap<HTMLDivElement, { transform: string; visibility: string }>());
  const dimensions=useRef(new WeakMap<HTMLDivElement,{width:number;height:number}>());
  const motionRevision=useRef(-1);
  useFrame(() => {
    const start = debugEnabled ? performance.now() : 0;
    camera.updateMatrixWorld();
    if (motionRevision.current===graph.revision && prior.world.equals(camera.matrixWorld) && prior.projection.equals(camera.projectionMatrix) && prior.width === size.width && prior.height === size.height && prior.revision === registry.revision) { recordWork('projection', start); return; }
    motionRevision.current=graph.revision;
    const resized=prior.width!==size.width||prior.height!==size.height;
    prior.world.copy(camera.matrixWorld); prior.projection.copy(camera.projectionMatrix);
    prior.width = size.width; prior.height = size.height; prior.revision = registry.revision;
    const occupied:{left:number;right:number;top:number;bottom:number}[]=[];
    for(const element of registry.elements.values())if(resized||!dimensions.current.has(element))dimensions.current.set(element,{width:element.offsetWidth,height:element.offsetHeight});
    for (const [id, element] of registry.elements) {
      if(element.hidden) continue;
      const position = positions.get(id);
      if (!position) continue;
      const node = nodes.find(node => node.id === id)!;
      const offset = node.kind === 'person' ? -0.45 : node.kind === 'cluster' ? -0.44 : 0;
      vector.set(position[0], position[1] + offset, position[2]).project(camera);
      let x = (vector.x * 0.5 + 0.5) * size.width;
      let y = (-vector.y * 0.5 + 0.5) * size.height;
      const dim=dimensions.current.get(element)!;
      const box=(cx:number,cy:number)=>({left:cx-dim.width/2-5,right:cx+dim.width/2+5,top:cy-dim.height/2-5,bottom:cy+dim.height/2+5});
      if(element.classList.contains('projected-feature')){
        const px=x,py=y;
        for(const offset of [-27,-53,27,53,-78,78]){
          const cx=Math.max(dim.width/2+8,Math.min(size.width-dim.width/2-8,px));
          const cy=Math.max(dim.height/2+8,Math.min(size.height-dim.height/2-8,py+offset));
          const candidate=box(cx,cy);
          if(!occupied.some(o=>candidate.left<o.right&&candidate.right>o.left&&candidate.top<o.bottom&&candidate.bottom>o.top)){x=cx;y=cy;break;}
        }
      }
      occupied.push(box(x,y));
      const transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%)`;
      const visibility = vector.z > 1 || vector.z < -1 || Math.abs(vector.x)>1.1 || Math.abs(vector.y)>1.1 ? 'hidden' : 'visible';
      const previous = styles.current.get(element);
      if (previous?.transform !== transform) { element.style.transform = transform; if (debugEnabled) telemetry.styleWrites++; }
      if (previous?.visibility !== visibility) { element.style.visibility = visibility; if (debugEnabled) telemetry.styleWrites++; }
      styles.current.set(element, { transform, visibility });
    }
    recordWork('projection', start);
  });
  return null;
}

export function GraphLabels({ registry, activeId }: { registry: LabelRegistry; activeId: string | null }) {
  countRender('GraphLabels');
  const select = usePortfolioStore(state => state.select);
  const focus=usePortfolioStore(state=>state.focusGraph);
  const lens=usePortfolioStore(state=>state.graphLens);
  const hover = usePortfolioStore(state => state.hover);
  const query=usePortfolioStore(state=>state.queryResult);
  const replayIndex=usePortfolioStore(state=>state.replayIndex);
  const askFocused=usePortfolioStore(state=>state.askFocused);
  const mobile=useMediaQuery('(max-width:760px)');
  const compact=askFocused && mobile;
  const replayId=query && replayIndex!==null ? query.steps[replayIndex]?.sourceId : null;
  const activeNode = nodes.find(node => node.id === (activeId ?? replayId) && node.kind !== 'cluster' && node.kind !== 'person');
  const featuredCandidates=lens==='all'?['microgrid','darija','commerce']:lensWork(lens).map(n=>n.id);
  const featured=mobile?featuredCandidates.slice(0,lens==='all'?1:2):featuredCandidates;
  const register = (id: string, element: HTMLDivElement | null) => {
    if (registry.elements.get(id) === element) return;
    if (element) registry.elements.set(id, element); else registry.elements.delete(id);
    registry.revision++;
  };
  return <div className="graph-label-layer">
    <div className="projected-label" hidden={compact} ref={element => register('mouad', element)}>
      <button className="central-label" onClick={() => select('mouad')} onFocus={() => hover('mouad')} onBlur={() => hover(null)}>
        <span className="core-portrait"><img src={profile.photo} width="56" height="59" alt=""/></span><strong>{nodes[0]!.shortLabel}.</strong><span className="central-label-kicker">THE CONNECTING THREAD</span>
      </button>
    </div>
    {clusters.map(cluster => {
      return <div className="projected-label" hidden={compact} key={cluster.id} ref={element => register(cluster.id, element)}>
        <button className={`graph-label ${activeId === cluster.id ? 'is-active' : ''}`} style={{ '--cluster-color': cluster.color } as React.CSSProperties}
          onClick={() => focus(cluster.id)} onPointerEnter={() => hover(cluster.id)} onPointerLeave={() => hover(null)} onFocus={() => hover(cluster.id)} onBlur={() => hover(null)}>
          <span className="graph-label-number">{cluster.number} /</span> {copy(cluster.label)}
        </button>
      </div>;
    })}
    {!compact&&featured.map(id=><div className="projected-label projected-feature" key={id} ref={element=>register(id,element)}><button className="constellation-star-label" onClick={()=>focus(id)} onPointerEnter={()=>hover(id)} onPointerLeave={()=>hover(null)}><span/><strong>{nodes.find(n=>n.id===id)!.shortLabel}</strong><span aria-hidden="true">↗</span></button></div>)}
    {activeNode && (compact||!featured.includes(activeNode.id)) && <div className="projected-label projected-tooltip" ref={element => register(activeNode.id, element)}>
      <button className="node-tooltip" onClick={() => focus(activeNode.id)}>{activeNode.shortLabel}<span>FOLLOW THE CONNECTIONS ↗</span></button>
    </div>}
  </div>;
}
