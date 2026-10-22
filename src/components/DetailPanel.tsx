import { useEffect, useRef } from 'react';
import { clusters, nodeById, nodes, relationLabels, ui } from '../data/portfolio';
import { connectionsFor } from '../graph/relations';
import { copy } from '../types/portfolio';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { ArrowIcon } from './Icons';
import { SourceLinks } from './SourceLinks';
import { profile } from '../data/portfolio';

export function DetailPanel() {
  const selectedId = usePortfolioStore(state => state.selectedId);
  const select = usePortfolioStore(state => state.select);
  const node = selectedId ? nodeById.get(selectedId) : undefined;
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const open = Boolean(node);
  useEffect(() => {
    if (!open) { if (dialog.current?.open) dialog.current.close(); return; }
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.current?.showModal();
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = priorOverflow;
      previousFocus.current?.focus({ preventScroll: true });
    };
  }, [open]);
  useEffect(() => { if (node) { title.current?.focus({ preventScroll: true }); dialog.current?.querySelector('.detail-body')?.scrollTo(0, 0); } }, [node]);
  const cluster = clusters.find(cluster => cluster.id === node?.cluster);
  const related = node ? connectionsFor(node.id) : [];
  const members = node?.kind === 'cluster' ? nodes.filter(member => member.cluster === node.cluster && member.kind !== 'cluster') : [];
  return <dialog className="detail-panel" ref={dialog} aria-labelledby="detail-title" aria-describedby="detail-summary"
    onCancel={() => select(null)} onClose={() => select(null)}
    onClick={event => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) select(null); } }}>
    {node && <><div className="detail-topline"><span className="mono">{node.kind === 'person' ? copy(ui.brand) : cluster ? copy(cluster.label) : ''}</span><button className="close-panel" onClick={() => select(null)} aria-label={copy(ui.close)}>×</button></div>
      <div className="detail-body">{node.kind === 'person' && <img className="detail-portrait" src={profile.photo} alt={profile.name} width="192" height="203" />}<p className="eyebrow">{copy(node.eyebrow)}</p><h2 id="detail-title" ref={title} tabIndex={-1}>{node.label}</h2>{node.period && <p className="detail-period mono">{node.period}</p>}{node.status && <p className="detail-status mono">{node.status}</p>}{node.role && <p className="detail-role">{node.role}</p>}<p id="detail-summary" className="detail-summary">{copy(node.summary)}</p>
        {node.metrics && <div className="detail-metrics">{node.metrics.map(metric => <div key={metric.value}><span className="mono">{copy(metric.label)}</span><strong>{metric.value}</strong><p>{copy(metric.context)}</p></div>)}</div>}
        {node.image && <figure className="detail-project-image"><a href={node.image.src} target="_blank" rel="noreferrer"><img src={node.image.src} alt={node.image.alt} width="800" height="450" /></a><figcaption>From the original project report. Select to view the full image.</figcaption></figure>}
        {node.details.length > 0 && <section className="detail-section"><h3>{copy(ui.story)}</h3><ul>{node.details.map((detail, index) => <li key={index}>{copy(detail)}</li>)}</ul></section>}
        {node.approach && <section className="detail-section"><h3>The approach</h3><ol className="detail-approach">{node.approach.map(step => <li key={step.title}><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol></section>}
        {node.takeaway && <blockquote className="detail-takeaway">{node.takeaway}</blockquote>}
        {node.sources && <section className="detail-section"><h3>Explore the original work</h3><SourceLinks sources={node.sources} /></section>}
        {node.technologies.length > 0 && <section className="detail-section"><h3>{copy(ui.technology)}</h3><div className="detail-tags">{node.technologies.map(id => <button key={id} onClick={() => select(id)}>{nodeById.get(id)!.label}<ArrowIcon diagonal /></button>)}</div></section>}
        {members.length > 0 && <section className="detail-section"><h3>{copy(ui.directory)}</h3><div className="detail-member-list">{members.map(member => <button key={member.id} onClick={() => select(member.id)}>{member.label}<ArrowIcon /></button>)}</div></section>}
        {related.length > 0 && <section className="detail-section"><h3>{copy(ui.related)}</h3><div className="connection-list">{related.map(connection => <button key={connection.edge.id} onClick={() => select(connection.node.id)}><span className="mono relation-label">{copy(relationLabels[connection.edge.relation])}{connection.edge.source === node.id ? ' →' : ' ←'}</span><span>{connection.node.label}</span><ArrowIcon diagonal /></button>)}</div></section>}
        {node.kind === 'skill' && !related.some(connection => ['project','experience','research'].includes(connection.node.kind)) && <p className="detail-note">{copy(ui.noConnections)}</p>}
        <p className="detail-source mono">{copy(ui.sourceLabel)}</p>
      </div><div className="detail-footer"><button onClick={() => select(null)}>{copy(ui.backToGraph)}<ArrowIcon /></button></div></>}
  </dialog>;
}
