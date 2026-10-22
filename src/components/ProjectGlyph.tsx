import { additionalGlyph } from './AdditionalGlyph';
// Lightweight vector illustrations; application screenshots stay original.
export function ProjectGlyph({ project }: { project: string }) {
  const additional = additionalGlyph(project);
  if (additional) return <svg className="project-glyph" viewBox="0 0 300 160" fill="none" aria-hidden="true"><defs><pattern id={`dots-${project}`} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r=".7" fill="currentColor" opacity=".25" /></pattern></defs><rect width="300" height="160" fill={`url(#dots-${project})`} />{additional}</svg>;
  return <svg className="project-glyph" viewBox="0 0 300 160" fill="none" aria-hidden="true">
    <defs><pattern id={`dots-${project}`} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r=".7" fill="currentColor" opacity=".25" /></pattern></defs>
    <rect width="300" height="160" fill={`url(#dots-${project})`} />
    {project === 'darija' ? <g stroke="currentColor"><ellipse cx="150" cy="80" rx="85" ry="28" transform="rotate(-20 150 80)" opacity=".3" /><ellipse cx="150" cy="80" rx="85" ry="28" transform="rotate(35 150 80)" opacity=".3" /><path d="m150 35 35 45-35 45-35-45Z" /><circle cx="150" cy="80" r="8" fill="currentColor" /><circle cx="75" cy="106" r="3" fill="currentColor" /><circle cx="205" cy="46" r="3" fill="currentColor" /></g> : project === 'microgrid' ? <g stroke="currentColor"><path d="m66 94 44-26 44 26-44 26ZM110 68V43m44 51 40-23 40 23-40 23Z" opacity=".65" /><path d="m85 82 44 26m-26-37 44 26m-57 8 44-26" opacity=".4" /><path d="M154 94v25l40 23 40-23V94m-40 23v25" /><path d="M194 71V42" strokeDasharray="3 4" /><circle cx="194" cy="34" r="8" /><path d="m70 120 20 12 20-12" opacity=".4" /></g> : <g stroke="currentColor"><path d="M62 112h175M62 112V44" opacity=".3" /><path d="m73 93 37-12 26 9 38-31 24 13 30-26" strokeWidth="1.5" /><circle cx="110" cy="81" r="4" fill="currentColor" /><circle cx="174" cy="59" r="4" fill="currentColor" /><circle cx="228" cy="46" r="4" fill="currentColor" /><path d="M110 81v31m64-53v53m54-66v66" strokeDasharray="3 4" opacity=".3" /></g>}
  </svg>;
}
