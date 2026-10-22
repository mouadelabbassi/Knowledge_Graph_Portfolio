import { entries, ui } from '../data/portfolio';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { ArrowIcon } from './Icons';
import { ProjectGlyph } from './ProjectGlyph';

export function SelectedWork() {
  const select = usePortfolioStore(state => state.select);
  return <section className="content-section selected-work" id="work" aria-labelledby="work-title">
    <div className="section-heading"><div><p className="eyebrow">{copy(ui.featuredKicker)}</p><h2 id="work-title">{copy(ui.featuredTitle)}</h2></div><p className="section-intro">{copy(ui.featuredDescription)}</p></div>
    <div className="project-grid">{entries.filter(node => node.kind === 'project').map((node, index) => <article className={`project-card project-${node.id}`} key={node.id}>
      <div className="project-card-top"><span className="mono">0{index + 1}</span><span className="project-category">{copy(node.eyebrow)}</span></div>
      <ProjectGlyph project={node.id} />
      <h3><button onClick={() => select(node.id)}>{node.label}<ArrowIcon diagonal /></button></h3>
      <p>{copy(node.summary)}</p>
      {node.metrics?.map(metric => <div className="project-evidence" key={metric.value}><strong>{metric.value}</strong><span>{copy(metric.label)}</span></div>)}
      <button className="story-link" onClick={() => select(node.id)}>{copy(ui.readStory)} <ArrowIcon /></button>
    </article>)}</div>
  </section>;
}
