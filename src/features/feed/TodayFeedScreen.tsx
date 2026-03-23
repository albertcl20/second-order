import { View, StyleSheet } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { StoryCard } from '@/src/components/ui/StoryCard';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { rankStories } from '@/src/lib/story-intelligence';
import { colors, spacing } from '@/src/theme/tokens';
import { useAppStore } from '@/src/store/useAppStore';

export function TodayFeedScreen() {
  const savedStoryIds = useAppStore((state) => state.savedStoryIds);
  const watchTokens = useAppStore((state) => state.watchTokens);
  const roleFocus = useAppStore((state) => state.roleFocus);
  const interestFocus = useAppStore((state) => state.interestFocus);
  const toggleSaved = useAppStore((state) => state.toggleSaved);

  const rankedStories = rankStories({
    savedStoryIds,
    watchTokens,
    roleFocus,
    interestFocus,
  });

  const lead = rankedStories[0];

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <AppText variant="caption">Today’s briefing</AppText>
        <AppText variant="hero">What today’s news changes tomorrow.</AppText>
        <AppText variant="body">
          Consequences, winners, losers, and what to watch — without the headline sludge.
        </AppText>
      </View>

      <SectionCard eyebrow="Your lens" title={`${roleFocus.join(' + ')} focus`}>
        <AppText variant="bodySmall">
          Prioritising {interestFocus.join(', ')} with watchlist coverage on {watchTokens.join(', ')}.
        </AppText>
      </SectionCard>

      {lead ? (
        <View style={styles.editorNote}>
          <AppText variant="caption">Best match right now</AppText>
          <AppText variant="section">{lead.title}</AppText>
          <AppText variant="bodySmall">
            Ranked {lead.relevanceScore}/99 because it overlaps your role focus and highest-signal watch topics.
          </AppText>
        </View>
      ) : null}

      <View style={styles.list}>
        {rankedStories.map((story) => (
          <StoryCard key={story.id} story={story} onToggleSaved={toggleSaved} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  editorNote: {
    padding: spacing.xl,
    borderRadius: 24,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.sm,
  },
  list: {
    gap: spacing.lg,
  },
});
