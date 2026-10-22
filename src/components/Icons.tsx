export function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function GraphMark() {
  return <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="m20 3 6 11 11 6-11 6-6 11-6-11L3 20l11-6Z" stroke="currentColor" /><path d="m8 8 12 5 12-5-5 12 5 12-12-5-12 5 5-12Z" stroke="currentColor" opacity=".5" /><circle cx="20" cy="20" r="3" fill="currentColor" /></svg>;
}
export function LocationIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
