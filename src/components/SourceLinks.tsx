import type { ProjectSource } from '../types/portfolio';
import { ArrowIcon } from './Icons';
export function SourceLinks({ sources }: { sources?: ProjectSource[] }) {
  if (!sources?.length) return null;
  return <div className="source-links">{sources.map(source => <a key={source.href} href={source.href} target="_blank" rel="noreferrer" download={source.format !== 'PDF'}><span><strong>{source.label}</strong><small>{source.format} · {source.size}</small></span><ArrowIcon diagonal /></a>)}</div>;
}
