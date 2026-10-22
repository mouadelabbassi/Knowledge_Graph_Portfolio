import type { LocalizedString } from './portfolio';

export interface ReasoningStep {
  id: string;
  kind: 'match' | 'relation' | 'evidence';
  text: string;
  edgeId?: string;
  sourceId?: string;
  targetId?: string;
}
export interface QueryResult {
  status: 'matched' | 'unknown';
  question: string;
  matchedTerms: string[];
  nodeIds: string[];
  edgeIds: string[];
  explanations: LocalizedString[];
  query: string;
  steps: ReasoningStep[];
}
