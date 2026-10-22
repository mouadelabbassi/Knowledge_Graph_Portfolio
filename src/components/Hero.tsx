import { profile, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { ArrowIcon, LocationIcon } from './Icons';
import { GraphShell } from './GraphShell';

export function Hero() {
  const select = usePortfolioStore(state => state.select);
  return <section className="hero" id="top" aria-labelledby="hero-name">
    <div className="hero-copy">
      <div className="hero-identity"><img src={profile.photo} alt="Mouad El Abbassi" width="72" height="76" fetchPriority="high" /><div><div className="availability"><span className="status-dot" />{copy(ui.availability)}</div><span className="mono">CURIOUS BY NATURE. ENGINEER BY PRACTICE.</span></div></div>
      <p className="eyebrow hero-kicker">{copy(ui.heroKicker)}</p>
      <h1 id="hero-name">{profile.name.split(' ')[0]}<br />{profile.name.split(' ').slice(1).join(' ')}<span className="name-period">.</span></h1>
      <p className="hero-title">{copy(profile.title)}</p>
      <p className="hero-location"><LocationIcon />{copy(profile.location)}<span> / </span>{copy(profile.education)}</p>
      <p className="hero-statement">{copy(ui.heroLineOne)}<br /><em>{copy(ui.heroLineTwo)}</em></p>
      <p className="hero-description">{copy(ui.heroDescription)}</p>
      <div className="hero-actions"><a className="button button-primary" href="#work">{copy(ui.explore)}<ArrowIcon /></a><button className="button button-link" onClick={() => select('mouad')}>{copy(ui.viewProfile)}<ArrowIcon diagonal /></button></div>
    </div>
    <div className="hero-graph" id="graph"><GraphShell /></div>
    <div className="hero-bottom"><a className="scroll-cue" href="#work"><span aria-hidden="true">↓</span>{copy(ui.scroll)}</a><span className="hero-bottom-note">14 PROJECTS · 1 RESEARCH EXPLORATION</span><a className="hero-index" href="#about">THE PERSON BEHIND THE GRAPH ↗</a></div>
  </section>;
}
