import { mockStories } from '@/src/fixtures/stories';
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
  return [...mockStories]
    .map((story) => scoreStory(story, preferences))
    .sort((a, b) => b.relevanceScore - a.relevanceScore || b.publishedAt.localeCompare(a.publishedAt));
}

export function getSavedStories(preferences: Preferences) {
  return rankStories(preferences).filter((story) => story.isSaved);
}

export function getThemeSummary(preferences: Preferences) {
  const ranked = rankStories(preferences);

  const buckets = new Map<string, { label: string; count: number; average: number; strongest: string }>();

  ranked.forEach((story) => {
    const existing = buckets.get(story.topic);
    if (!existing) {
      buckets.set(story.topic, {
        label: story.topic,
        count: 1,
        average: story.relevanceScore,
        strongest: story.title,
      });
      return;
    }

    buckets.set(story.topic, {
      label: existing.label,
      count: existing.count + 1,
      average: Math.round((existing.average * existing.count + story.relevanceScore) / (existing.count + 1)),
      strongest: existing.average >= story.relevanceScore ? existing.strongest : story.title,
    });
  });

  return [...buckets.values()].sort((a, b) => b.average - a.average);
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
