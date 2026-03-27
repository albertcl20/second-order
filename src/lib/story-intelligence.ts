import { validatedStories } from '@/src/fixtures/story-feed';
import { InterestFocus, RoleFocus, Story } from '@/src/types/story';

type Preferences = {
  roleFocus: RoleFocus[];
  interestFocus: InterestFocus[];
  watchTokens: string[];
  savedStoryIds: string[];
};

export type RankedStory = Story & {
  relevanceScore: number;
  relevanceReasons: string[];
  isSaved: boolean;
};

const interestTagMap: Record<InterestFocus, string[]> = {
  AI: ['AI', 'enterprise-ai', 'model-routing', 'OpenAI', 'Anthropic'],
  Policy: ['Policy', 'ai-governance', 'EU AI Act', 'security review', 'compliance'],
  Markets: ['Markets', 'software-pricing', 'acquisition', 'cloud pricing'],
  Infrastructure: ['Infrastructure', 'gpu', 'inference', 'finops'],
  Distribution: ['Distribution', 'SEO', 'answer-engines', 'Microsoft', 'distribution'],
};

export function rankStories(preferences: Preferences) {
  return [...validatedStories]
    .map((story) => scoreStory(story, preferences))
    .sort((a, b) => b.relevanceScore - a.relevanceScore || b.publishedAt.localeCompare(a.publishedAt));
}

export function getSavedStories(preferences: Preferences) {
  return rankStories(preferences).filter((story) => story.isSaved);
}

export type ThemeSummary = {
  label: string;
  count: number;
  average: number;
  strongest: string;
  strongestStoryId: string;
  strongestReason: string;
  watchDrivers: string[];
  benefitDrivers: string[];
  riskDrivers: string[];
  watchSignals: string[];
};

export type WatchlistSummary = {
  token: string;
  count: number;
  average: number;
  strongestStoryId: string;
  strongestTitle: string;
  strongestReason: string;
  strongestTopic: string;
  beneficiaries: string[];
  pressurePoints: string[];
  watchItems: string[];
};

export function getThemeSummary(preferences: Preferences): ThemeSummary[] {
  const ranked = rankStories(preferences);

  const buckets = new Map<
    string,
    {
      label: string;
      count: number;
      total: number;
      strongest: string;
      strongestStoryId: string;
      strongestScore: number;
      strongestReason: string;
      watchDrivers: Map<string, number>;
      benefitDrivers: Map<string, number>;
      riskDrivers: Map<string, number>;
      watchSignals: Map<string, number>;
    }
  >();

  ranked.forEach((story) => {
    const existing = buckets.get(story.topic) ?? {
      label: story.topic,
      count: 0,
      total: 0,
      strongest: story.title,
      strongestStoryId: story.id,
      strongestScore: -1,
      strongestReason: story.relevanceReasons[0] ?? 'current lens match',
      watchDrivers: new Map<string, number>(),
      benefitDrivers: new Map<string, number>(),
      riskDrivers: new Map<string, number>(),
      watchSignals: new Map<string, number>(),
    };

    existing.count += 1;
    existing.total += story.relevanceScore;

    if (story.relevanceScore > existing.strongestScore) {
      existing.strongest = story.title;
      existing.strongestStoryId = story.id;
      existing.strongestScore = story.relevanceScore;
      existing.strongestReason = story.relevanceReasons[0] ?? 'current lens match';
    }

    story.watchTokens.forEach((token) => incrementToken(existing.watchDrivers, token));
    story.analysis.whoBenefits.forEach((item) => incrementToken(existing.benefitDrivers, item));
    story.analysis.whoLoses.forEach((item) => incrementToken(existing.riskDrivers, item));
    story.analysis.whatToWatch.forEach((item) => incrementToken(existing.watchSignals, item));

    buckets.set(story.topic, existing);
  });

  return [...buckets.values()]
    .map((bucket) => ({
      label: bucket.label,
      count: bucket.count,
      average: Math.round(bucket.total / bucket.count),
      strongest: bucket.strongest,
      strongestStoryId: bucket.strongestStoryId,
      strongestReason: bucket.strongestReason,
      watchDrivers: pickTopTokens(bucket.watchDrivers, 3),
      benefitDrivers: pickTopTokens(bucket.benefitDrivers, 2),
      riskDrivers: pickTopTokens(bucket.riskDrivers, 2),
      watchSignals: pickTopTokens(bucket.watchSignals, 2),
    }))
    .sort((a, b) => b.average - a.average);
}

export function getWatchlistSummary(preferences: Preferences): WatchlistSummary[] {
  const ranked = rankStories(preferences);

  return preferences.watchTokens
    .map((token) => {
      const matches = ranked.filter((story) =>
        story.watchTokens.some((item) => item.toLowerCase().includes(token.toLowerCase())),
      );

      if (!matches.length) {
        return {
          token,
          count: 0,
          average: 0,
          strongestStoryId: '',
          strongestTitle: 'No matching briefing yet',
          strongestReason: 'Add more editorial coverage for this token',
          strongestTopic: 'Unmapped',
          beneficiaries: [],
          pressurePoints: [],
          watchItems: [],
        } satisfies WatchlistSummary;
      }

      const strongest = matches[0];
      const beneficiaries = new Map<string, number>();
      const pressurePoints = new Map<string, number>();
      const watchItems = new Map<string, number>();

      matches.forEach((story) => {
        story.analysis.whoBenefits.forEach((item) => incrementToken(beneficiaries, item));
        story.analysis.whoLoses.forEach((item) => incrementToken(pressurePoints, item));
        story.analysis.whatToWatch.forEach((item) => incrementToken(watchItems, item));
      });

      return {
        token,
        count: matches.length,
        average: Math.round(matches.reduce((total, story) => total + story.relevanceScore, 0) / matches.length),
        strongestStoryId: strongest.id,
        strongestTitle: strongest.title,
        strongestReason: strongest.relevanceReasons[0] ?? 'current lens match',
        strongestTopic: strongest.topic,
        beneficiaries: pickTopTokens(beneficiaries, 2),
        pressurePoints: pickTopTokens(pressurePoints, 2),
        watchItems: pickTopTokens(watchItems, 3),
      } satisfies WatchlistSummary;
    })
    .sort((a, b) => b.average - a.average || b.count - a.count || a.token.localeCompare(b.token));
}

export function getLensSummary(preferences: Preferences) {
  const ranked = rankStories(preferences);
  const topStory = ranked[0];
  const savedCount = ranked.filter((story) => story.isSaved).length;
  const averageScore = ranked.length
    ? Math.round(ranked.reduce((total, story) => total + story.relevanceScore, 0) / ranked.length)
    : 0;

  return {
    topStory,
    savedCount,
    averageScore,
    mostRelevantTopic: topStory?.topic,
  };
}

function scoreStory(story: Story, preferences: Preferences): RankedStory {
  let score = 20;
  const reasons: string[] = [];

  preferences.roleFocus.forEach((role) => {
    if (story.recommendedFor.includes(role)) {
      score += 12;
    }
  });

  preferences.interestFocus.forEach((interest) => {
    const matches = interestTagMap[interest].some((token) =>
      [story.topic, ...story.tags, ...story.watchTokens].join(' ').toLowerCase().includes(token.toLowerCase()),
    );

    if (matches) {
      score += 10;
      reasons.push(`${interest} fit`);
    }
  });

  preferences.watchTokens.forEach((token) => {
    if (story.watchTokens.some((item) => item.toLowerCase().includes(token.toLowerCase()))) {
      score += 14;
      reasons.push(`watching ${token}`);
    }
  });

  const strongestSignal = Object.entries(story.signals).sort((a, b) => b[1] - a[1])[0];
  score += Math.round(strongestSignal[1] / 8);
  reasons.push(`${labelSignal(strongestSignal[0])} signal ${strongestSignal[1]}/100`);

  return {
    ...story,
    relevanceScore: Math.min(score, 99),
    relevanceReasons: [...new Set(reasons)].slice(0, 3),
    isSaved: preferences.savedStoryIds.includes(story.id),
  };
}

function labelSignal(signal: string) {
  if (signal === 'market') return 'market';
  if (signal === 'product') return 'product';
  if (signal === 'operatingRisk') return 'risk';
  return 'distribution';
}

function incrementToken(bucket: Map<string, number>, token: string) {
  bucket.set(token, (bucket.get(token) ?? 0) + 1);
}

function pickTopTokens(bucket: Map<string, number>, limit: number) {
  return [...bucket.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([token]) => token);
}
