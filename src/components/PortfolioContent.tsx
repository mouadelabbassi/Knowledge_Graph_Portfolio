import { Community, Credentials } from './Credentials';
import { entries, nodeById, profile, skills, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { ArrowIcon, GraphMark } from './Icons';

export function PortfolioContent() {
  const select = usePortfolioStore(state => state.select);
  return <>
    <section className="content-section about-section" id="about" aria-labelledby="about-title"><figure className="about-portrait"><img src={profile.photo} alt="Mouad El Abbassi smiling against a blue background" width="960" height="1015" loading="lazy" /><figcaption className="mono">MOUAD EL ABBASSI / CASABLANCA, MOROCCO</figcaption></figure><div className="about-copy"><p className="eyebrow">THE PERSON / BEHIND THE CONNECTIONS</p><h2 id="about-title">I like turning<br />curiosity into something useful.</h2><p>I’m Mouad, a final-year Data Science & AI Engineering student at ENSA Khouribga. My work moves between language, data, and software, with a growing interest in systems that can explain the decisions they make.</p><p>A hotel booking platform taught me to build end to end. Data projects taught me to question the input. Language models and energy systems brought those lessons together.</p><div className="about-focus"><span className="mono">WHAT I’M LOOKING FOR</span><p>{copy(profile.objective)}</p></div><div className="about-links"><a href={`mailto:${profile.links.email}`}>Let’s connect <ArrowIcon diagonal /></a><a href={profile.links.github} target="_blank" rel="noreferrer">GitHub <ArrowIcon diagonal /></a><a href={`https://${profile.links.linkedin}`} target="_blank" rel="noreferrer">LinkedIn <ArrowIcon diagonal /></a></div></div></section>
    <section className="content-section experience-section" id="experience" aria-labelledby="experience-title">
      <p className="eyebrow">{copy(ui.experienceKicker)}</p><h2 id="experience-title">{copy(ui.experienceTitle)}</h2>
      <div className="experience-list">{entries.filter(node => node.kind === 'experience').map(node => <article className="experience-row" key={node.id}>
        <p className="experience-period mono">{node.period}</p>
        <div><h3><button onClick={() => select(node.id)}>{node.label}<ArrowIcon diagonal /></button></h3><p className="experience-role">{copy(node.eyebrow)}</p><p className="experience-summary">{copy(node.summary)}</p><ul className="experience-details">{node.details.map((detail, index) => <li key={index}>{copy(detail)}</li>)}</ul></div>
        <div className="experience-evidence">{node.metrics?.map(metric => <div key={metric.value}><span className="mono">{copy(metric.label)}</span><strong><span>{metric.before}</span><span className="metric-arrow" aria-hidden="true">↗</span>{metric.after}</strong></div>)}</div>
      </article>)}</div>
    </section>
    <Community />
    <section className="content-section skills-section" id="skills" aria-labelledby="skills-title">
      <div className="section-heading"><div><p className="eyebrow">{copy(ui.skillsKicker)}</p><h2 id="skills-title">{copy(ui.skillsTitle)}</h2></div><p className="section-intro">{copy(ui.skillsDescription)}</p></div>
      <div className="skill-categories">{ui.skillCategories.map(category => <div className="skill-category" key={copy(category.name)}><h3>{copy(category.name)}</h3><div>{category.ids.map(id => <button key={id} className="skill-chip" onClick={() => select(id)}>{nodeById.get(id)!.label}<span aria-hidden="true">↗</span></button>)}</div></div>)}</div>
      <span className="sr-only">{skills.map(node => node.label).join(', ')}</span>
    </section>
    <section className="content-section foundations-section" id="education" aria-labelledby="education-title">
      <p className="eyebrow">{copy(ui.educationKicker)}</p><h2 id="education-title">{copy(ui.educationTitle)}</h2>
      <div className="foundations-grid"><div className="education-block"><span className="mono">{copy(ui.educationLabel)}</span><h3><button onClick={() => select('ensa')}>{nodeById.get('ensa')!.label} <ArrowIcon diagonal /></button></h3><p>{copy(profile.education)}</p><p>{copy(profile.title)}</p></div><div className="languages-block"><span className="mono">{copy(ui.languages)}</span>{profile.languages.map(language => <p key={language.label}><strong>{language.label}</strong><span>{copy(language.level)}</span></p>)}</div></div>
    </section>
    <Credentials />
    <footer className="site-footer"><GraphMark /><div><p>{copy(ui.footerLine)}</p><span>{copy(profile.objective)}</span></div><span className="mono">{copy(ui.footerNote)}</span></footer>
  </>;
}
