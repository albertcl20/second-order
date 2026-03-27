import { useMemo } from 'react';
import { useAppStore } from '@/src/store/useAppStore';
import { getLensSummary, getSavedStories, getThemeSummary, getWatchlistSummary, rankStories } from '@/src/lib/story-intelligence';

export function useBriefing() {
  const savedStoryIds = useAppStore((state) => state.savedStoryIds);
  const savedThemeLabels = useAppStore((state) => state.savedThemeLabels);
  const watchTokens = useAppStore((state) => state.watchTokens);
  const roleFocus = useAppStore((state) => state.roleFocus);
  const interestFocus = useAppStore((state) => state.interestFocus);

  const preferences = useMemo(
    () => ({
      savedStoryIds,
      savedThemeLabels,
      watchTokens,
      roleFocus,
      interestFocus,
    }),
    [interestFocus, roleFocus, savedStoryIds, savedThemeLabels, watchTokens],
  );

  return useMemo(() => {
    const rankedStories = rankStories(preferences);

    return {
      preferences,
      rankedStories,
      savedStories: getSavedStories(preferences),
      themes: getThemeSummary(preferences),
      watchlist: getWatchlistSummary(preferences),
      lens: getLensSummary(preferences),
    };
  }, [preferences]);
}
