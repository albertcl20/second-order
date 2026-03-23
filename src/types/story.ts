export type ConfidenceLevel = 'High confidence' | 'Plausible' | 'Early signal';

export type StoryAnalysis = {
  whatHappened: string;
  whyItMatters: string;
  whoBenefits: string[];
  whoLoses: string[];
  whatHappensNext: string[];
  whatToWatch: string[];
  opportunityRisk: string;
  confidence: ConfidenceLevel;
  uncertainty: string;
};

export type StorySource = {
  label: string;
  url: string;
};

export type RoleFocus = 'Product' | 'Founder' | 'Operator' | 'Investor';
export type InterestFocus = 'AI' | 'Policy' | 'Markets' | 'Infrastructure' | 'Distribution';

export type StorySignal = {
  market: number;
  product: number;
  operatingRisk: number;
  distribution: number;
};

export type Story = {
  id: string;
  title: string;
  kicker: string;
  readingTime: number;
  publishedAt: string;
  topic: string;
  summary: string;
  analysis: StoryAnalysis;
  sources: StorySource[];
  tags: string[];
  watchTokens: string[];
  recommendedFor: RoleFocus[];
  signals: StorySignal;
};
