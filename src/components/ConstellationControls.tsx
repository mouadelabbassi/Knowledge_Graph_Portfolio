import { entries, nodeById } from '../data/portfolio';
import { evidenceCount, graphLenses, lensWork } from '../graph/presentation';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { ArrowIcon } from './Icons';

export function ConstellationControls({expanded,toggleExpanded}:{expanded:boolean;toggleExpanded:()=>void}){
  const lens=usePortfolioStore(s=>s.graphLens),setLens=usePortfolioStore(s=>s.setGraphLens),focusId=usePortfolioStore(s=>s.graphFocusId),focus=usePortfolioStore(s=>s.focusGraph),select=usePortfolioStore(s=>s.select),askFocused=usePortfolioStore(s=>s.askFocused);
  const activeLens=graphLenses.find(item=>item.id===lens)!;
  const node=focusId?nodeById.get(focusId):undefined;
  const work=lensWork(lens);
  const zoom=usePortfolioStore(s=>s.zoomGraph),reset=usePortfolioStore(s=>s.resetCamera),paused=usePortfolioStore(s=>s.paused),pause=usePortfolioStore(s=>s.togglePaused),neural=usePortfolioStore(s=>s.neuralLinks),toggleNeural=usePortfolioStore(s=>s.toggleNeuralLinks);
  if(askFocused)return null;
  return <div className="constellation-controls">
    <div className="constellation-navigation" role="group" aria-label="3D network controls">
      <button onClick={()=>zoom(.8)} aria-label="Zoom in" title="Zoom in"><span aria-hidden="true">+</span></button>
      <button onClick={()=>zoom(1.25)} aria-label="Zoom out" title="Zoom out"><span aria-hidden="true">−</span></button>
      <button onClick={reset} aria-label="Reset network view" title="Reset position and orientation"><span aria-hidden="true">↺</span></button>
      <button onClick={pause} aria-label={paused?'Resume floating nodes':'Pause floating nodes'} aria-pressed={!paused} title={paused?'Resume floating nodes':'Pause floating nodes'}><svg viewBox="0 0 24 24" aria-hidden="true">{paused?<path d="m9 5 10 7-10 7Z"/>:<path d="M8 5v14M16 5v14"/>}</svg></button>
      <button onClick={toggleNeural} aria-label="Neural connections" aria-pressed={neural} title="Show all neural connections"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 5M6 6l3 13m9-8-9 8"/><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="11" r="2.5"/><circle cx="9" cy="19" r="2.5"/></svg></button>
    </div>
    <div className="constellation-topbar"><span className="constellation-caption mono"><span/>A LIVING CONSTELLATION</span><button className="constellation-expand" onClick={toggleExpanded} aria-expanded={expanded} aria-label={expanded?'Exit full-screen constellation':'Expand the constellation'}>{expanded?'Return to portfolio':'Explore in full screen'} <span aria-hidden="true">{expanded?'↙':'↗'}</span></button></div>
    <div className="constellation-lenses" role="group" aria-label="Explore a field">{graphLenses.map(item=><button key={item.id} onClick={()=>setLens(item.id)} aria-pressed={lens===item.id} style={{'--lens-color':item.color} as React.CSSProperties}><span/>{item.label}</button>)}</div>
    <div className={`constellation-insight ${node?'has-focus':''}`}>
      {node?<><div className="constellation-insight-head"><span className="mono">{node.kind==='cluster'?'EXPLORE A CONSTELLATION':'FOLLOW THE CONNECTIONS'}</span><button onClick={()=>focus(null)} aria-label="Clear graph focus">×</button></div><h3>{node.label}</h3><p>{copy(node.summary)}</p><div className="constellation-insight-footer"><span className="mono">{evidenceCount(node.id)} DOCUMENTED LINKS</span><button onClick={()=>select(node.id)}>{node.kind==='cluster'?'Browse the nodes':'Open the story'}<ArrowIcon diagonal/></button></div></>:<><span className="mono">{lens==='all'?'START ANYWHERE':'A CLOSER LOOK'}</span><p>{activeLens.description}</p>{lens!=='all'&&<div className="constellation-work-links">{work.map(item=><button key={item.id} onClick={()=>focus(item.id)}>{item.shortLabel}<ArrowIcon diagonal/></button>)}</div>}<span className="constellation-instruction">Select a star. Follow what it connects to.</span></>}
    </div>
    {expanded&&<aside className="constellation-directory" aria-label="Constellation quick directory"><span className="mono">THE WORK / {work.length} CONNECTIONS</span>{work.map(item=><button key={item.id} className={focusId===item.id?'is-current':''} onClick={()=>focus(item.id)}><span>{item.kind==='research'?'↗':'·'}</span>{item.shortLabel}</button>)}<span className="mono directory-secondary">THE PERSON</span>{entries.filter(item=>item.kind==='experience').map(item=><button key={item.id} onClick={()=>focus(item.id)}>{item.shortLabel}</button>)}</aside>}
  </div>;
}
