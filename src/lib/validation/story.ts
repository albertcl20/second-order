import { z } from 'zod';

export const confidenceSchema = z.enum(['High confidence', 'Plausible', 'Early signal']);
export const roleSchema = z.enum(['Product', 'Founder', 'Operator', 'Investor']);

export const sourceSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

export const storyAnalysisSchema = z.object({
  whatHappened: z.string(),
  whyItMatters: z.string(),
  whoBenefits: z.array(z.string()),
  whoLoses: z.array(z.string()),
  whatHappensNext: z.array(z.string()),
  whatToWatch: z.array(z.string()),
  opportunityRisk: z.string(),
  confidence: confidenceSchema,
  uncertainty: z.string(),
});

export const storySchema = z.object({
  id: z.string(),
  title: z.string(),
  kicker: z.string(),
  readingTime: z.number(),
  publishedAt: z.string(),
  topic: z.string(),
  summary: z.string(),
  analysis: storyAnalysisSchema,
  sources: z.array(sourceSchema),
  tags: z.array(z.string()),
  watchTokens: z.array(z.string()),
  recommendedFor: z.array(roleSchema),
  signals: z.object({
    market: z.number(),
    product: z.number(),
    operatingRisk: z.number(),
    distribution: z.number(),
  }),
});

export const storiesSchema = z.array(storySchema);

export type StorySchema = z.infer<typeof storySchema>;
