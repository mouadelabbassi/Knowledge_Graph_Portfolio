import { useEffect, useRef, useState } from 'react';
import { nodeById, queryIntents, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { fillCopy } from '../graph/intentMatcher';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ArrowIcon } from './Icons';
import { countRender } from '../debug/telemetry';

export function AskMouad({ compact = false }: { compact?: boolean }) {
  countRender('AskMouad');
  const [question, setQuestion] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const section = useRef<HTMLElement>(null);
  const askFocused = usePortfolioStore(state=>state.askFocused);
  const focusAsk = usePortfolioStore(state=>state.setAskFocused);
  const result = usePortfolioStore(state=>state.queryResult);
  const ask = usePortfolioStore(state=>state.ask);
  const clear = usePortfolioStore(state=>state.clearQuery);
  const select = usePortfolioStore(state=>state.select);
  const replayIndex = usePortfolioStore(state=>state.replayIndex);
  const running = usePortfolioStore(state=>state.replayRunning);
  const start = usePortfolioStore(state=>state.startReplay);
  const pause = usePortfolioStore(state=>state.pauseReplay);
  const resume = usePortfolioStore(state=>state.continueReplay);
  const step = usePortfolioStore(state=>state.stepReplay);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  useEffect(()=>{
    if(!askFocused || compact) return;
    const answer=section.current?.querySelector<HTMLElement>('.ask-answer');
    section.current?.scrollTo({top:answer ? Math.max(0,answer.offsetTop-20) : 0,behavior:'instant'});
  },[result,askFocused,compact]);
  useEffect(()=>{
    if(!askFocused || compact || !window.visualViewport) return;
    const viewport=window.visualViewport;
    const resize=()=>{
      section.current?.style.setProperty('--ask-visible-height',`${viewport.height}px`);
      section.current?.style.setProperty('--ask-mobile-graph-height',viewport.height<650 ? '150px' : '250px');
      document.documentElement.style.setProperty('--ask-mobile-graph-height',viewport.height<650 ? '150px' : '250px');
    };
    resize();viewport.addEventListener('resize',resize);
    return()=>{viewport.removeEventListener('resize',resize);document.documentElement.style.removeProperty('--ask-mobile-graph-height');};
  },[askFocused,compact]);
  useEffect(()=>{
    if(!askFocused || compact) return;
    const priorFocus=document.activeElement instanceof HTMLElement ? document.activeElement : null;
    input.current?.focus({preventScroll:true});
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape' && !document.querySelector('dialog[open]')) { pause();focusAsk(false); }};
    window.addEventListener('keydown',escape);
    return ()=>{
      window.removeEventListener('keydown',escape);
      if(document.activeElement?.closest('.ask-section')) priorFocus?.focus({preventScroll:true});
    };
  },[askFocused,compact,focusAsk,pause]);
  useEffect(() => {
    if (!running) return;
    if (reducedMotion) { pause(); return; }
    const timer = setInterval(()=>step(1),1400);
    return ()=>clearInterval(timer);
  }, [running,reducedMotion,pause,step]);
  const submit = (value: string) => { setQuestion(value); ask(value); if (usePortfolioStore.getState().queryResult?.status==='matched') start(!reducedMotion); };
  const activeStep = result && replayIndex !== null ? result.steps[replayIndex] : undefined;
  return <section ref={section} className={`ask-section ${compact ? 'ask-compact' : ''}`} id="ask" aria-labelledby="ask-title">
    {askFocused && !compact && <button className="ask-close" aria-label={copy(ui.askClose)} onClick={()=>{pause();focusAsk(false);}}>×</button>}
    <div className="ask-heading"><div><p className="eyebrow">{copy(ui.askKicker)}</p><h2 id="ask-title">{copy(ui.askTitle)}</h2></div><p>{copy(ui.askDescription)}</p></div>
    <form className="ask-form" onSubmit={event=>{event.preventDefault();submit(question);}}><label className="sr-only" htmlFor="ask-question">{copy(ui.askInput)}</label><span className="ask-prompt-sign" aria-hidden="true">↳</span><input ref={input} id="ask-question" value={question} onChange={event=>setQuestion(event.target.value)} placeholder={copy(ui.askPlaceholder)} maxLength={500} autoComplete="off" /><button className="button button-primary" type="submit" disabled={!question.trim()}>{copy(ui.askSubmit)}<ArrowIcon /></button></form>
    <div className="ask-suggestions">{queryIntents.map(intent=><button type="button" key={intent.id} onClick={()=>submit(copy(intent.question))}>{copy(intent.question)} <span aria-hidden="true">↗</span></button>)}</div>
    {result && <div className="ask-answer">
      <div className="ask-answer-top"><h3>{copy(result.status==='matched' ? ui.askResults : ui.askUnknown)}</h3><button onClick={()=>{clear();setQuestion('');input.current?.focus({preventScroll:true});}}>{copy(ui.askClear)} ×</button></div>
      <div className="ask-answer-summary" role="status" aria-live="polite">{result.status==='unknown' ? <p>{copy(ui.askUnknownDetail)}</p> : result.explanations.map((explanation,index)=><p key={index}>{copy(explanation)}</p>)}</div>
      {result.status==='matched' && <>
        <div className="ask-match-terms"><span className="mono">{copy(ui.askMatchedTerms)}</span>{result.matchedTerms.map(term=><span key={term}>{term}</span>)}</div>
        <div className="ask-result-nodes">{result.nodeIds.map(id=><button onClick={()=>select(id)} key={id}>{nodeById.get(id)!.shortLabel}<ArrowIcon diagonal /></button>)}</div>
        <details className="query-preview" open><summary>{copy(ui.askQuery)}</summary><pre><code>{result.query}</code></pre><p>{copy(ui.askLocalNote)}</p></details>
        <div className="replay-toolbar"><button className="replay-start" onClick={()=>{if(!compact) focusAsk(true);start(!reducedMotion);}}>{copy(ui.askReplay)} <span aria-hidden="true">↻</span></button>{replayIndex!==null && <><button onClick={()=>{pause();step(-1);}} disabled={replayIndex===0}>{copy(ui.askPrevious)}</button>{!reducedMotion && <button onClick={running ? pause : resume}>{copy(running ? ui.askPauseReplay : ui.askResumeReplay)}</button>}<button onClick={()=>{pause();step(1);}} disabled={replayIndex>=result.steps.length-1}>{copy(ui.askNext)}</button></>}</div>
        {reducedMotion && <p className="replay-motion-note">{copy(ui.askReducedReplay)}</p>}
        {activeStep && <div className="reasoning-replay" aria-live="polite"><span className="mono">{fillCopy(copy(ui.askStep),{current:String((replayIndex??0)+1),total:String(result.steps.length)})}</span><p>{activeStep.text}</p><ol aria-label={copy(ui.askSteps)}>{result.steps.map((item,index)=><li key={item.id}><button aria-current={index===replayIndex ? 'step' : undefined} onClick={()=>{pause();usePortfolioStore.setState({replayIndex:index});}}>{item.text}</button></li>)}</ol></div>}
      </>}
    </div>}
  </section>;
}
