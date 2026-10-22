import { readFile, writeFile } from 'node:fs/promises';
import { entries, nodeById, profile, skills, ui } from '../src/data/portfolio.ts';
import { copy } from '../src/types/portfolio.ts';
import { generateOgSvg } from './og-image.ts';

const escape = (text: string): string => text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
const p = (text: string): string => `<p>${escape(text)}</p>`;

// Only plain HTML text is prerendered. No React, three, layout, or scene imports.
const sections = entries.map(node => `<article id="static-${escape(node.id)}">
  <h2>${escape(node.label)}</h2>
  ${p(copy(node.eyebrow))}${node.period ? p(node.period) : ''}${p(copy(node.summary))}
  ${node.details.length ? `<ul>${node.details.map(detail => `<li>${escape(copy(detail))}</li>`).join('')}</ul>` : ''}
  ${node.metrics?.map(metric => p(`${copy(metric.label)}: ${metric.value}. ${copy(metric.context)}`)).join('') ?? ''}
  ${node.status ? p(node.status) : ''}
  ${node.approach?.map(step => `<h3>${escape(step.title)}</h3>${p(step.text)}`).join('') ?? ''}
  ${node.takeaway ? p(node.takeaway) : ''}
  ${node.technologies.length ? p('Skills: ' + node.technologies.map(id => nodeById.get(id)!.label).join(', ')) : ''}
  ${node.sources?.map(source => `<p><a href="${escape(source.href)}">${escape(source.label)}</a> (${escape(source.format)}, ${escape(source.size)})</p>`).join('') ?? ''}
</article>`).join('\n');

const textContent = `<main id="portfolio-static" aria-label="${escape(copy(ui.directory))}">
  <img src="${escape(profile.photo)}" alt="${escape(profile.name)}" width="192" height="203" />
  <h1>${escape(profile.name)}</h1>${p(copy(profile.title))}${p(copy(profile.location))}${p(copy(profile.education))}${p(copy(profile.objective))}
  ${sections}
  <section><h2>${escape(copy(ui.skillsTitle))}</h2><ul>${skills.map(skill => `<li>${escape(skill.label)}</li>`).join('')}</ul></section>
  <section><h2>${escape(copy(ui.languages))}</h2><ul>${profile.languages.map(language => `<li>${escape(language.label)}: ${escape(copy(language.level))}</li>`).join('')}</ul></section>
</main>`;
const html = await readFile('dist/index.html', 'utf8');
if (!html.includes('<!-- PORTFOLIO_TEXT -->')) throw new Error('Prerender insertion marker missing.');
await writeFile('dist/index.html', html.replace('<!-- PORTFOLIO_TEXT -->', textContent));
await writeFile('dist/og-image.svg', generateOgSvg());
console.log(`Prerendered ${entries.length} entries and ${skills.length} skills as HTML text. No scene prerendering.`);
