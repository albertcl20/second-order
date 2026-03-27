import { GestureResponderEvent, Pressable, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { StoryCard } from '@/src/components/ui/StoryCard';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { useAppStore } from '@/src/store/useAppStore';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { useBriefing } from '@/src/features/briefing/useBriefing';

export default function SavedRoute() {
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const toggleSavedTheme = useAppStore((state) => state.toggleSavedTheme);
  const savedThemeLabels = useAppStore((state) => state.savedThemeLabels);
  const setSubscriptionTier = useAppStore((state) => state.setSubscriptionTier);
  const { savedStories, rankedStories, preferences, themes, access } = useBriefing();
  const leadSaved = savedStories[0];
  const suggestions = rankedStories.filter((story) => !story.isSaved).slice(0, 2);
  const savedThemes = themes.filter((theme) => savedThemeLabels.includes(theme.label));

  const handleInlineSave = (event: GestureResponderEvent, storyId: string) => {
    event.stopPropagation();
    if (access.savedStoriesAtLimit) return;
    toggleSaved(storyId);
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="hero">Saved</AppText>
        <AppText variant="body">Your personal desk of stories and themes worth revisiting.</AppText>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <AppText variant="caption">Stories saved</AppText>
          <AppText variant="section">{savedStories.length}</AppText>
          <AppText variant="bodySmall">Live desk count for this preview session.</AppText>
        </View>
        <View style={styles.metricCard}>
          <AppText variant="caption">Themes saved</AppText>
          <AppText variant="section">{savedThemes.length}</AppText>
          <AppText variant="bodySmall">Narratives you want to keep tracking.</AppText>
        </View>
      </View>

      {!access.isPremium ? (
        <SectionCard eyebrow="Free desk limit" title={`${savedStories.length}/${access.savedStoryLimit} story saves used`}>
          <AppText variant="bodySmall">
            Free keeps a tight revisit queue. Premium preview removes the save cap so the desk can act like a real working backlog.
          </AppText>
          <Pressable
            onPress={() => setSubscriptionTier('Premium preview')}
            style={({ pressed }) => [styles.themeCta, pressed && styles.themeCtaPressed]}>
            <AppText variant="bodySmall" style={styles.themeCtaText}>Switch to premium preview</AppText>
          </Pressable>
        </SectionCard>
      ) : null}

      <SectionCard
        eyebrow="Desk overview"
        title={savedStories.length || savedThemes.length ? `${savedStories.length} stories · ${savedThemes.length} themes` : 'Your desk is empty'}>
        <AppText variant="bodySmall">
          {savedStories.length || savedThemes.length
            ? 'Saved items stay ranked against your current lens, so the strongest revisit always floats to the top.'
            : 'Start in Today or Themes and save anything you want to keep in your second-order queue.'}
        </AppText>
        <View style={styles.tokenRow}>
          {preferences.watchTokens.slice(0, 3).map((token) => (
            <View key={token} style={styles.token}>
              <AppText variant="caption" style={styles.tokenText}>
                {token}
              </AppText>
            </View>
          ))}
        </View>
      </SectionCard>

      {leadSaved ? (
        <Pressable onPress={() => router.push(`/story/${leadSaved.id}`)} style={({ pressed }) => [styles.resumeCard, pressed && styles.resumePressed]}>
          <AppText variant="caption" style={styles.resumeMeta}>Best revisit right now</AppText>
          <AppText variant="section" style={styles.resumeTitle}>{leadSaved.title}</AppText>
          <AppText variant="bodySmall" style={styles.resumeBody}>
            Still scoring {leadSaved.relevanceScore}/99 for your current lens.
          </AppText>
        </Pressable>
      ) : null}

      {savedThemes.length ? (
        <SectionCard eyebrow="Saved themes" title="Narratives you chose to keep on the desk">
          <View style={styles.savedThemeList}>
            {savedThemes.map((theme) => (
              <View key={theme.label} style={styles.savedThemeCard}>
                <View style={styles.savedThemeHeader}>
                  <View style={styles.savedThemeCopy}>
                    <AppText variant="body">{theme.label}</AppText>
                    <AppText variant="bodySmall">{theme.average}/99 relevance · {theme.count} linked {theme.count === 1 ? 'story' : 'stories'}</AppText>
                  </View>
                  <Pressable onPress={() => toggleSavedTheme(theme.label)} hitSlop={10} style={styles.inlineRemove}>
                    <AppText variant="bodySmall" style={styles.inlineRemoveText}>Remove</AppText>
                  </Pressable>
                </View>
                <AppText variant="bodySmall">Lead briefing: {theme.strongest}</AppText>
                <AppText variant="bodySmall">Watch: {theme.watchSignals.join(' · ')}</AppText>
                <Pressable
                  onPress={() => router.push(`/story/${theme.strongestStoryId}`)}
                  style={({ pressed }) => [styles.themeCta, pressed && styles.themeCtaPressed]}>
                  <AppText variant="bodySmall" style={styles.themeCtaText}>Open lead briefing</AppText>
                </Pressable>
              </View>
            ))}
          </View>
        </SectionCard>
      ) : null}

      {savedStories.length ? (
        <View style={styles.list}>
          {savedStories.map((story) => (
            <StoryCard key={story.id} story={story} onToggleSaved={toggleSaved} />
          ))}
        </View>
      ) : null}

      <SectionCard eyebrow="Build your desk" title="High-signal stories to save next">
        {suggestions.length ? (
          <View style={styles.suggestionList}>
            {suggestions.map((story) => (
              <Pressable
                key={story.id}
                onPress={() => router.push(`/story/${story.id}`)}
                style={({ pressed }) => [styles.suggestionRow, pressed && styles.suggestionRowPressed]}>
                <View style={styles.suggestionCopy}>
                  <AppText variant="body">{story.title}</AppText>
                  <AppText variant="bodySmall">{story.relevanceScore}/99 fit · {story.topic}</AppText>
                </View>
                <Pressable
                  onPress={(event) => handleInlineSave(event, story.id)}
                  disabled={access.savedStoriesAtLimit}
                  hitSlop={10}
                  style={[styles.inlineSave, access.savedStoriesAtLimit && styles.inlineSaveDisabled]}>
                  <AppText variant="bodySmall" style={[styles.inlineSaveText, access.savedStoriesAtLimit && styles.inlineSaveTextDisabled]}>
                    {access.savedStoriesAtLimit ? 'Limit reached' : 'Save'}
                  </AppText>
                </Pressable>
              </Pressable>
            ))}
          </View>
        ) : (
          <AppText variant="bodySmall">You’ve already saved everything in this build.</AppText>
        )}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  tokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  token: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  tokenText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
  },
  resumeCard: {
    padding: spacing.xl,
    borderRadius: 28,
    backgroundColor: colors.text,
    gap: spacing.sm,
  },
  resumePressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  resumeBody: {
    color: colors.surfaceMuted,
  },
  resumeMeta: {
    color: colors.surfaceMuted,
  },
  resumeTitle: {
    color: colors.surface,
  },
  savedThemeList: {
    gap: spacing.md,
  },
  savedThemeCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  savedThemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  savedThemeCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  inlineRemove: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  inlineRemoveText: {
    color: colors.danger,
    fontWeight: '600',
  },
  themeCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
  themeCtaPressed: {
    opacity: 0.84,
  },
  themeCtaText: {
    color: colors.surface,
    fontWeight: '600',
  },
  list: {
    gap: spacing.lg,
  },
  suggestionList: {
    gap: spacing.md,
  },
  suggestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionRowPressed: {
    opacity: 0.8,
  },
  suggestionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  inlineSave: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
  },
  inlineSaveDisabled: {
    backgroundColor: '#F1ECE4',
  },
  inlineSaveText: {
    color: colors.accent,
    fontWeight: '600',
  },
  inlineSaveTextDisabled: {
    color: colors.textSecondary,
  },
});
