import { useMemo, useState } from 'react';
import { entries, nodeById, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { ArrowIcon } from './Icons';
import { ProjectGlyph } from './ProjectGlyph';
import { SourceLinks } from './SourceLinks';

const projects = entries.filter(node => node.kind === 'project');
const categories = ['All projects', 'AI & language', 'Data & analytics', 'Software & systems'] as const;
export function SelectedWork() {
  const select = usePortfolioStore(state => state.select);
  const [category, setCategory] = useState<string>('All projects');
  const [search, setSearch] = useState('');
  const visible = useMemo(() => projects.filter(node => (category === 'All projects' || node.category === category) && [node.label, copy(node.summary), ...node.aliases, ...node.technologies.map(id => nodeById.get(id)!.label)].join(' ').toLowerCase().includes(search.trim().toLowerCase())), [category, search]);
  return <section className="content-section selected-work" id="work" aria-labelledby="work-title">
    <div className="section-heading"><div><p className="eyebrow">{copy(ui.featuredKicker)}</p><h2 id="work-title">{copy(ui.featuredTitle)}</h2></div><p className="section-intro">{copy(ui.featuredDescription)}</p></div>
    <div className="archive-toolbar"><div className="archive-filters" role="group" aria-label="Filter projects by field">{categories.map(name => <button key={name} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}<span>{name === 'All projects' ? projects.length : projects.filter(node => node.category === name).length}</span></button>)}</div><label className="archive-search"><span className="sr-only">Search projects or skills</span><input type="search" placeholder="Find a project or skill…" value={search} onChange={event => setSearch(event.target.value)} /><span aria-hidden="true">⌕</span></label></div>
    <div className="archive-caption"><p className="mono" aria-live="polite">{visible.length} / {projects.length} PROJECTS</p><a href="#research">Explore the research <ArrowIcon diagonal /></a></div>
    <div className="project-grid">{visible.map(node => <article className={`project-card project-${node.id}`} key={node.id}>
      <div className="project-card-top"><span className="mono">{String(projects.indexOf(node) + 1).padStart(2, '0')}</span><span className="project-category">{copy(node.eyebrow)}</span></div>
      {node.image ? <button className="project-image-button" onClick={() => select(node.id)} aria-label={`Explore ${node.label}`}><img className="project-image" src={node.image.src} alt={node.image.alt} loading="lazy" width="800" height="450" /></button> : <ProjectGlyph project={node.id} />}
      <div className="project-status"><span>{node.status}</span>{node.period && <span>{node.period}</span>}</div>
      <h3><button onClick={() => select(node.id)}>{node.label}<ArrowIcon diagonal /></button></h3><p>{copy(node.summary)}</p>
      <div className="project-skill-preview">{node.technologies.slice(0, 4).map(id => <button onClick={() => select(id)} key={id}>{nodeById.get(id)!.label}</button>)}{node.technologies.length > 4 && <button onClick={() => select(node.id)}>+{node.technologies.length - 4} skills</button>}</div>
      {node.metrics?.slice(0, 1).map(metric => <div className="project-evidence" key={metric.value}><strong>{metric.value}</strong><span>{copy(metric.label)}</span></div>)}
      <button className="story-link" onClick={() => select(node.id)}>{copy(ui.readStory)} <ArrowIcon /></button>
    </article>)}</div>
    {!visible.length && <div className="archive-empty"><p>No projects match this search.</p><button onClick={() => { setSearch(''); setCategory('All projects'); }}>Show all projects <ArrowIcon /></button></div>}
    <p className="archive-footnote">Every project has a story. Open one to explore the approach, skills, and original report where available.</p>
  </section>;
}
export function Research() {
  const select = usePortfolioStore(state => state.select);
  return <section className="content-section research-section" id="research" aria-labelledby="research-title">
    <div className="section-heading"><div><p className="eyebrow">RESEARCH / THE NEXT QUESTION</p><h2 id="research-title">What if the model<br /><em>designed the algorithm?</em></h2></div><p className="section-intro">Where operations research meets generative AI. Exploring how search methods can evolve alongside the problems they solve.</p></div>
    {entries.filter(node => node.kind === 'research').map(node => <article className="research-feature" key={node.id}>
      <div className="research-story"><span className="research-status mono">{node.status}</span><h3><button onClick={() => select(node.id)}>{node.label}<ArrowIcon diagonal /></button></h3><p>{copy(node.summary)}</p><blockquote>{node.takeaway}</blockquote><button className="button button-primary" onClick={() => select(node.id)}>Explore the research <ArrowIcon /></button><SourceLinks sources={node.sources} /></div>
      <div className="research-loop" aria-label="Research architecture: model constraints, generate a heuristic, evaluate in a sandbox, return feedback"><div className="loop-heading mono">THE ALGORITHM IS THE SEARCH SPACE</div>{[{ n: '01', title: 'Define the problem', text: 'Hard constraints. Soft preferences. Timetabling.' }, { n: '02', title: 'Generate a heuristic', text: 'LLM variation over genetic and local-search operators.' }, { n: '03', title: 'Evaluate & learn', text: 'Sandbox the code. Measure fitness. Return feedback.' }].map(step => <div className="loop-step" key={step.n}><span className="mono">{step.n}</span><div><h4>{step.title}</h4><p>{step.text}</p></div><span aria-hidden="true">↓</span></div>)}<p className="loop-return mono"><span aria-hidden="true">↺</span> REFINE THE ALGORITHM. REPEAT.</p></div>
    </article>)}
  </section>;
}
