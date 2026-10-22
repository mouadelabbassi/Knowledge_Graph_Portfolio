import { profile, ui } from '../src/data/portfolio.ts';
import { copy } from '../src/types/portfolio.ts';

const escape = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function generateOgSvg(): string {
  const [firstName, ...rest] = profile.name.split(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0a1618"/><g stroke="#2cc6af" stroke-opacity=".35" fill="none"><path d="m840 130 120 185-120 185-120-185Z"/><path d="M650 180 840 315 1080 160M650 440 840 315 1080 480"/><circle cx="840" cy="315" r="80"/><circle cx="840" cy="315" r="130"/></g><g fill="#2cc6af"><circle cx="840" cy="315" r="10"/><circle cx="650" cy="180" r="5"/><circle cx="1080" cy="160" r="5"/><circle cx="1080" cy="480" r="5"/><circle cx="650" cy="440" r="5"/></g><text x="80" y="140" fill="#2cc6af" font-family="monospace" font-size="18" letter-spacing="3">${escape(copy(ui.brand))}</text><text x="80" y="290" fill="#f2ebdd" font-family="sans-serif" font-size="78">${escape(firstName ?? profile.name)}</text><text x="80" y="385" fill="#f2ebdd" font-family="sans-serif" font-size="78">${escape(rest.join(' '))}.</text><text x="80" y="480" fill="#bac7c3" font-family="sans-serif" font-size="23">${escape(copy(profile.title))}</text><text x="80" y="545" fill="#f6b85b" font-family="monospace" font-size="18">${escape(copy(profile.location))} · ${escape(copy(ui.availability))}</text></svg>`;
}
