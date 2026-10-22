export type Locale = 'en' | 'fr' | 'ar';
export type CopyProvenance = 'provided' | 'machine-written' | 'machine-translation';
export interface Translation {
  text: string;
  provenance: CopyProvenance;
  reviewed: boolean;
}
export interface LocalizedString {
  en: Translation;
  fr: Translation | null;
  ar: Translation | null;
}
export type ClusterId = 'experience' | 'projects' | 'skills' | 'certifications' | 'education';
export type NodeKind = 'person' | 'cluster' | 'experience' | 'volunteering' | 'project' | 'research' | 'skill' | 'technology' | 'certification' | 'education';
export type ProjectCategory = 'AI & language' | 'Data & analytics' | 'Software & systems';
export interface ProjectSource { label: string; href: string; format: string; size: string }
export interface Metric {
  label: LocalizedString;
  value: string;
  before?: string;
  after?: string;
  context: LocalizedString;
}
export interface PortfolioNode {
  id: string;
  label: string;
  shortLabel: string;
  kind: NodeKind;
  cluster: ClusterId | null;
  eyebrow: LocalizedString;
  summary: LocalizedString;
  details: LocalizedString[];
  role?: string;
  period?: string;
  technologies: string[];
  metrics?: Metric[];
  aliases: string[];
  nameAliases?: string[];
  featured?: boolean;
  category?: ProjectCategory;
  status?: string;
  sources?: ProjectSource[];
  image?: { src: string; alt: string };
  approach?: { title: string; text: string }[];
  takeaway?: string;
}
export type Relation = 'CONNECTS_TO' | 'WORKED_AT' | 'VOLUNTEERED_AT' | 'BUILT' | 'RESEARCHED' | 'COVERS' | 'HAS_SKILL' | 'EARNED' | 'STUDIES_AT' | 'CONTAINS' | 'USED' | 'BUILT_WITH' | 'TRAINED' | 'VALIDATED_WITH';
export interface PortfolioEdge {
  id: string;
  source: string;
  target: string;
  relation: Relation;
  evidence: 'provided' | 'navigation';
}
export interface Cluster {
  id: ClusterId;
  label: LocalizedString;
  description: LocalizedString;
  color: string;
  anchor: [number, number, number];
  number: string;
}
export interface QueryIntent {
  id: string;
  question: LocalizedString;
  aliases: string[];
  nodes: string[];
  explanation: LocalizedString;
  query: string;
}

export function copy(value: LocalizedString, locale: Locale = 'en'): string {
  return (value[locale] ?? value.en).text;
}
