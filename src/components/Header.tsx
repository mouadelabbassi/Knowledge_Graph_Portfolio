import { ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { GraphMark } from './Icons';

export function Header() {
  const select = usePortfolioStore(state => state.select);
  const recruiterMode = usePortfolioStore(state=>state.recruiterMode);
  const toggleRecruiter = usePortfolioStore(state=>state.toggleRecruiterMode);
  const askFocused = usePortfolioStore(state=>state.askFocused);
  const focusAsk = usePortfolioStore(state=>state.setAskFocused);
  return <header className="site-header">
    <a className="brand" href={recruiterMode ? '#cv-profile' : '#top'} onClick={()=>focusAsk(false)} aria-label={copy(ui.brand)}><GraphMark /><span>{copy(ui.brandShort)}<span className="brand-subtitle">{copy(ui.brand)}</span></span></a>
    <nav aria-label={copy(ui.navigationLabel)}>
      {recruiterMode ? <><a href="#cv-experience">{copy(ui.cvExperience)}</a><a href="#cv-projects">{copy(ui.cvProjects)}</a><a className="desktop-nav-link" href="#cv-skills">{copy(ui.cvSkills)}</a></> : <><a href="#graph" onClick={()=>focusAsk(false)}>{copy(ui.graph)}<span className="nav-dot" /></a><a className="desktop-nav-link" href="#work" onClick={()=>focusAsk(false)}>{copy(ui.work)}</a><button aria-expanded={askFocused} aria-controls="ask" onClick={()=>focusAsk(!askFocused)}>{copy(ui.askNav)}</button><a className="desktop-nav-link" href="#research" onClick={()=>focusAsk(false)}>Research</a><button className="desktop-nav-link" onClick={() => select('mouad')}>{copy(ui.about)} <span aria-hidden="true">↗</span></button></>}
    </nav>
    <button className="recruiter-toggle" aria-label={copy(recruiterMode ? ui.graphMode : ui.recruiterMode)} aria-pressed={recruiterMode} onClick={()=>{toggleRecruiter();window.scrollTo({top:0,behavior:'instant'});}}><span className="recruiter-toggle-full">{copy(recruiterMode ? ui.graphMode : ui.recruiterMode)}</span><span className="recruiter-toggle-short">{copy(recruiterMode ? ui.graphMode : ui.recruiterShort)}</span><span aria-hidden="true">↗</span></button>
  </header>;
}
