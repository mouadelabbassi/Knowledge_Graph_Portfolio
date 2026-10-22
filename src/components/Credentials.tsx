import { entries, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { ArrowIcon } from './Icons';

export function Credentials() {
  const select = usePortfolioStore(state => state.select);
  return <section className="content-section credentials-section" id="certifications" aria-labelledby="certifications-title"><div className="section-heading"><div><p className="eyebrow">CREDENTIALS / CONTINUOUS LEARNING</p><h2 id="certifications-title">Keep building.<br />Keep learning.</h2></div><p className="section-intro">Eight credentials across AI fundamentals, engineering, generative models, and data. A foundation I put to work in the projects above.</p></div><div className="certification-list">{entries.filter(node => node.kind === 'certification').map(node => <article className="credential-row" key={node.id}><span className="credential-mark" aria-hidden="true">{copy(node.eyebrow) === 'IBM' ? 'IBM' : 'DC'}</span><div><h3><button onClick={() => select(node.id)}>{node.label} <ArrowIcon diagonal /></button></h3><p>{copy(node.eyebrow)}</p>{node.period && <p className="mono">Issued {node.period}</p>}</div></article>)}</div></section>;
}

export function Community() {
  const select = usePortfolioStore(state => state.select);
  return <section className="content-section volunteer-section" id="community" aria-labelledby="community-title"><div className="section-heading"><div><p className="eyebrow">COMMUNITY / SHOWING UP</p><h2 id="community-title">Good work takes people.</h2></div><p className="section-intro">The work beyond the code: helping campus events happen, supporting the team, and learning to communicate.</p></div><div className="volunteer-grid">{entries.filter(node => node.kind === 'volunteering').map((node, i) => <article className="volunteer-card" key={node.id}><span className="mono">0{i + 1} / VOLUNTEERING</span><h3><button onClick={() => select(node.id)}>{node.label} <ArrowIcon diagonal /></button></h3><p className="volunteer-role">{node.role}</p><p className="volunteer-period">{node.period}</p><p>{copy(node.summary)}</p><button className="story-link" onClick={() => select(node.id)}>{copy(ui.readStory)} <ArrowIcon /></button></article>)}</div></section>;
}
