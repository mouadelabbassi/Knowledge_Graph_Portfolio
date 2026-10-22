import { SourceLinks } from './SourceLinks';
import { entries, nodeById, profile, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import type { PortfolioNode } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { AskMouad } from './AskMouad';

function CvEntry({ node }: { node: PortfolioNode }) {
  const select = usePortfolioStore(state=>state.select);
  return <article className="cv-entry"><div className="cv-entry-heading"><h3><button onClick={()=>select(node.id)}>{node.label}</button></h3>{node.period && <span className="mono">{node.period}</span>}</div><p className="cv-entry-role">{copy(node.eyebrow)}</p><p>{copy(node.summary)}</p>{node.status && <p className="cv-entry-status">{node.status}</p>}<ul>{node.details.map((detail,index)=><li key={index}>{copy(detail)}</li>)}</ul>{node.technologies.length>0 && <p className="cv-technologies"><strong>{copy(ui.technology)}: </strong>{node.technologies.map(id=>nodeById.get(id)!.label).join(' · ')}</p>}{node.takeaway && <p className="cv-entry-takeaway">{node.takeaway}</p>}<SourceLinks sources={node.sources} /></article>;
}

export function RecruiterView() {
  return <div className="cv-page">
    <section className="cv-profile" id="cv-profile"><img className="cv-headshot" src={profile.photo} alt={profile.name} width="104" height="110" /><div><p className="eyebrow">{copy(ui.cvKicker)}</p><h1>{profile.name}</h1><p className="cv-title">{copy(profile.title)}</p><p>{copy(profile.location)} · {copy(profile.education)}</p><p className="cv-objective">{copy(profile.objective)}</p></div><button className="cv-print" onClick={()=>window.print()}>{copy(ui.cvPrint)} ↗</button></section>
    <details className="cv-ask"><summary>{copy(ui.cvOpenAsk)} <span aria-hidden="true">+</span></summary><AskMouad compact /></details>
    <section className="cv-section" id="cv-experience"><h2>{copy(ui.cvExperience)}</h2>{entries.filter(node=>node.kind==='experience').map(node=><CvEntry key={node.id} node={node} />)}</section>
    <section className="cv-section" id="cv-projects"><h2>{copy(ui.cvProjects)}</h2>{entries.filter(node=>node.kind==='project').map(node=><CvEntry key={node.id} node={node} />)}</section>
    <section className="cv-section" id="cv-research"><h2>Research</h2>{entries.filter(node=>node.kind==='research').map(node=><CvEntry key={node.id} node={node} />)}</section>
    <section className="cv-section" id="cv-community"><h2>Volunteering</h2>{entries.filter(node=>node.kind==='volunteering').map(node=><CvEntry key={node.id} node={node} />)}</section>
    <section className="cv-section" id="cv-skills"><h2>{copy(ui.cvSkills)}</h2><div className="cv-skill-groups">{ui.skillCategories.map(group=><div key={copy(group.name)}><h3>{copy(group.name)}</h3><p>{group.ids.map(id=>nodeById.get(id)!.label).join(' · ')}</p></div>)}</div></section>
    <div className="cv-foundations"><section className="cv-section"><h2>{copy(ui.cvEducation)}</h2><h3>{nodeById.get('ensa')!.label}</h3><p>{copy(nodeById.get('ensa')!.summary)}</p></section><section className="cv-section"><h2>{copy(ui.cvCertifications)}</h2>{entries.filter(node=>node.kind==='certification').map(node=><div className="cv-certificate" key={node.id}><h3>{node.label}</h3><p>{copy(node.eyebrow)}{node.period ? ` · ${node.period}` : ''}</p></div>)}</section></div>
    <div className="cv-foundations"><section className="cv-section"><h2>{copy(ui.languages)}</h2>{profile.languages.map(language=><p key={language.label}>{language.label} — {copy(language.level)}</p>)}</section><section className="cv-section cv-contact"><h2>{copy(ui.cvContact)}</h2><p>{copy(ui.cvEmail)}: <a href={`mailto:${profile.links.email}`}>{profile.links.email}</a></p><p>{copy(ui.cvGithub)}: <a href={profile.links.github} target="_blank" rel="noreferrer">{profile.links.github}</a></p><p>LinkedIn: <a href={`https://${profile.links.linkedin}`} target="_blank" rel="noreferrer">Mouad El Abbassi</a></p></section></div>
  </div>;
}
