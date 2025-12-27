export type Seniority =
  | 'C-Level'
  | 'VP'
  | 'Director'
  | 'Manager'
  | 'Individual Contributor';

export type IntentSignal =
  | 'Hiring'
  | 'Funding'
  | 'Content Engagement'
  | 'Job Change'
  | 'Technology Adoption';

export interface LeadRecord {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  employees: number;
  seniority: Seniority;
  linkedinUrl: string;
  recentActivity: string[];
  technologies: string[];
  signals: IntentSignal[];
  hiring: boolean;
  fundingRound?: string;
  annualRevenue?: number;
  emailStatus: 'Verified' | 'Guessed' | 'Unavailable';
  confidenceScore: number;
}

export interface LeadFilter {
  industries: string[];
  locations: string[];
  seniorities: Seniority[];
  technologies: string[];
  hiring: boolean | null;
  minEmployees?: number;
  maxEmployees?: number;
  minConfidence?: number;
  signals: IntentSignal[];
  query: string;
}

export interface PersonaProfile {
  id: string;
  name: string;
  painPoints: string[];
  valueDrivers: string[];
  tone: 'Consultative' | 'Challenger' | 'Casual' | 'Visionary';
  callToAction: string;
}
