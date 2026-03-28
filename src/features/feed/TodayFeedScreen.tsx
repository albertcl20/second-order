import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { StoryCard } from '@/src/components/ui/StoryCard';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { ReadingMode, useAppStore } from '@/src/store/useAppStore';
import { latestBriefingDate } from '@/src/fixtures/story-feed';
import { useBriefing } from '@/src/features/briefing/useBriefing';

export function TodayFeedScreen() {
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const setSubscriptionTier = useAppStore((state) => state.setSubscriptionTier);
  const readingMode = useAppStore((state) => state.readingMode);
  const { preferences, rankedStories, lens, themes, savedStories, dailySignal, access } = useBriefing();
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const topicChips = useMemo(() => {
    const topics = [...new Set(access.visibleStories.map((story) => story.topic))];
    return ['All', ...topics];
  }, [access.visibleStories]);

  const topicStories = useMemo(() => {
    if (selectedTopic === 'All') return access.visibleStories;
    return access.visibleStories.filter((story) => story.topic === selectedTopic);
  }, [access.visibleStories, selectedTopic]);

  const topicThemes = useMemo(() => {
    if (selectedTopic === 'All') return access.visibleThemes;
    return access.visibleThemes.filter((theme) => theme.label.toLowerCase() === selectedTopic.toLowerCase());
  }, [access.visibleThemes, selectedTopic]);

  const topThemes = topicThemes.slice(0, 3);
  const lead = topicStories[0] ?? access.visibleStories[0] ?? rankedStories[0];
  const resumeStory = selectedTopic === 'All' ? savedStories[0] : savedStories.find((story) => story.topic === selectedTopic) ?? savedStories[0];
  const upNext = topicStories.slice(1, 3);
  const { roleFocus, interestFocus, watchTokens } = preferences;

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <AppText variant="caption">Today’s briefing · {format(new Date(latestBriefingDate), 'EEEE d MMM')}</AppText>
        <AppText variant="hero">What today’s news changes tomorrow.</AppText>
        <AppText variant="body">
          Consequences, winners, losers, and what to watch — without the headline sludge.
        </AppText>
        <View style={styles.modePill}>
          <AppText variant="caption" style={styles.modePillText}>
            {readingModeLabel(readingMode)}
          </AppText>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <AppText variant="caption">Lead topic</AppText>
          <AppText variant="section">{selectedTopic === 'All' ? lens.mostRelevantTopic ?? '—' : selectedTopic}</AppText>
          <AppText variant="bodySmall">
            {selectedTopic === 'All'
              ? 'Highest-signal theme for your current lens.'
              : `Today filtered to ${topicStories.length} ${topicStories.length === 1 ? 'briefing' : 'briefings'} in this topic.`}
          </AppText>
        </View>
        <View style={styles.metricCard}>
          <AppText variant="caption">Average fit</AppText>
          <AppText variant="section">{lens.averageScore}/99</AppText>
          <AppText variant="bodySmall">Across {rankedStories.length} ranked stories today.</AppText>
        </View>
      </View>

      <SectionCard eyebrow="Topic chips" title="Shift the feed without leaving Today">
        <AppText variant="bodySmall">
          Use topic chips to collapse the briefing around one narrative lane instead of scrolling the whole stack.
        </AppText>
        <View style={styles.topicChipRow}>
          {topicChips.map((topic) => (
            <Chip key={topic} label={topic} active={selectedTopic === topic} onPress={() => setSelectedTopic(topic)} />
          ))}
        </View>
      </SectionCard>

      {!access.isPremium ? (
        <SectionCard eyebrow="Free plan" title={`You can read ${access.freeStoryLimit} full briefings per day on Free`}>
          <AppText variant="bodySmall">
            Premium unlocks the full daily feed, deeper analysis surfaces, and more room to build a saved desk.
          </AppText>
          <View style={styles.outlookRow}>
            <View style={styles.outlookPill}>
              <AppText variant="caption" style={styles.outlookPillText}>
                {access.visibleStories.length}/{rankedStories.length} open now
              </AppText>
            </View>
            <Pressable
              onPress={() => setSubscriptionTier('Premium preview')}
              style={({ pressed }) => [styles.primaryCta, pressed && styles.primaryCtaPressed]}>
              <AppText variant="body" style={styles.primaryCtaLabel}>
                Switch to premium preview
              </AppText>
            </Pressable>
          </View>
        </SectionCard>
      ) : null}

      {dailySignal ? (
        <SectionCard eyebrow={access.isPremium ? 'Premium daily signal' : 'Daily signal'} title={dailySignal.headline}>
          <View style={styles.editorNoteCard}>
            <AppText variant="caption">Editor note</AppText>
            <AppText variant="bodySmall">{dailySignal.editorNote}</AppText>
          </View>
          <View style={styles.signalIntelStack}>
            <View style={styles.signalIntelCard}>
              <AppText variant="caption">Opportunity</AppText>
              <AppText variant="bodySmall">{dailySignal.opportunityLine}</AppText>
            </View>
            <View style={styles.signalIntelCard}>
              <AppText variant="caption">Risk</AppText>
              <AppText variant="bodySmall">{dailySignal.riskLine}</AppText>
            </View>
            <View style={styles.signalIntelCard}>
              <AppText variant="caption">What to watch</AppText>
              <AppText variant="bodySmall">{dailySignal.watchLine}</AppText>
            </View>
          </View>
          <View style={styles.outlookRow}>
            <View style={styles.outlookPill}>
              <AppText variant="caption" style={styles.outlookPillText}>
                {dailySignal.confidenceLabel}
              </AppText>
            </View>
            <AppText variant="bodySmall">Synthesised from the top {dailySignal.sourceStoryIds.length} ranked briefings.</AppText>
          </View>
        </SectionCard>
      ) : null}

      {lead ? (
        <SectionCard eyebrow="Daily outlook" title={selectedTopic === 'All' ? 'Where the signal is clustering right now' : `Where ${selectedTopic} is moving next`}>
          <View style={styles.outlookRow}>
            <View style={styles.outlookPill}>
              <AppText variant="caption" style={styles.outlookPillText}>
                #{1} ranked
              </AppText>
            </View>
            <AppText variant="bodySmall">{lead.relevanceScore}/99 fit · {lead.topic}</AppText>
          </View>
          <AppText variant="body">{lead.title}</AppText>
          <AppText variant="bodySmall">
            Strongest pull: {lead.relevanceReasons[0] ?? 'current lens match'}.
          </AppText>
          <Pressable
            onPress={() => router.push(`/story/${lead.id}`)}
            style={({ pressed }) => [styles.primaryCta, pressed && styles.primaryCtaPressed]}>
            <AppText variant="body" style={styles.primaryCtaLabel}>
              Open lead briefing
            </AppText>
          </Pressable>
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Your lens" title={`${roleFocus.join(' + ')} focus`}>
        <AppText variant="bodySmall">
          Prioritising {interestFocus.join(', ')} with watchlist coverage on {watchTokens.join(', ')}.
        </AppText>
        <View style={styles.lensTokenRow}>
          {watchTokens.slice(0, 3).map((token) => (
            <View key={token} style={styles.lensToken}>
              <AppText variant="caption" style={styles.lensTokenText}>
                {token}
              </AppText>
            </View>
          ))}
        </View>
      </SectionCard>

      {resumeStory ? (
        <Pressable onPress={() => router.push(`/story/${resumeStory.id}`)} style={({ pressed }) => [styles.resumeCard, pressed && styles.pressedCard]}>
          <View style={styles.resumeHeader}>
            <AppText variant="caption" style={styles.resumeMeta}>Continue from your desk</AppText>
            <AppText variant="caption" style={styles.resumeMeta}>Saved</AppText>
          </View>
          <AppText variant="section" style={styles.resumeTitle}>{resumeStory.title}</AppText>
          <AppText variant="bodySmall" style={styles.resumeBody}>
            Your highest-ranked saved story is still {resumeStory.relevanceScore}/99 for the current lens.
          </AppText>
        </Pressable>
      ) : null}

      {upNext.length ? (
        <SectionCard eyebrow="Up next" title={selectedTopic === 'All' ? 'Two more stories worth your attention' : `Two more ${selectedTopic.toLowerCase()} briefings worth your attention`}>
          <View style={styles.upNextList}>
            {upNext.map((story, index) => (
              <Pressable key={story.id} onPress={() => router.push(`/story/${story.id}`)} style={({ pressed }) => [styles.upNextRow, pressed && styles.pressedRow]}>
                <View style={styles.upNextIndex}>
                  <AppText variant="caption" style={styles.upNextIndexText}>
                    0{index + 2}
                  </AppText>
                </View>
                <View style={styles.upNextCopy}>
                  <AppText variant="body">{story.title}</AppText>
                  <AppText variant="bodySmall">{story.relevanceScore}/99 fit · {story.topic}</AppText>
                </View>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Pattern scan" title={selectedTopic === 'All' ? 'The narratives pulling to the top' : `Narratives inside ${selectedTopic}`}>
        {topThemes.length ? (
          <View style={styles.themeList}>
            {topThemes.map((theme) => (
              <View key={theme.label} style={styles.themeRow}>
                <View style={styles.themeCopy}>
                  <AppText variant="body">{theme.label}</AppText>
                  <AppText variant="bodySmall">Strongest entry: {theme.strongest}</AppText>
                </View>
                <AppText variant="caption">{theme.average}/99</AppText>
              </View>
            ))}
          </View>
        ) : (
          <AppText variant="bodySmall">
            No filtered theme cluster mapped yet for this topic. Switch back to All to widen the narrative map.
          </AppText>
        )}
      </SectionCard>

      <SectionCard eyebrow="Desk status" title="How your session is shaping up">
        <View style={styles.sessionGrid}>
          <View style={styles.sessionMetric}>
            <AppText variant="caption">Saved now</AppText>
            <AppText variant="section">{lens.savedCount}</AppText>
          </View>
          <View style={styles.sessionMetric}>
            <AppText variant="caption">Watchlist</AppText>
            <AppText variant="section">{watchTokens.length}</AppText>
          </View>
        </View>
        <AppText variant="bodySmall">
          {lens.savedCount
            ? `${lens.savedCount} story ${lens.savedCount === 1 ? 'is' : 'stories are'} saved to your desk.`
            : 'Nothing saved yet — use save on any story to build a revisit queue.'}
        </AppText>
      </SectionCard>

      <View style={styles.list}>
        {topicStories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onToggleSaved={toggleSaved}
            saveDisabled={!story.isSaved && access.savedStoriesAtLimit}
          />
        ))}
      </View>

      {access.lockedStories.length ? (
        <SectionCard eyebrow="Premium briefings" title="More downstream analysis waiting below the free line">
          <AppText variant="bodySmall">
            Free shows the top {access.freeStoryLimit} briefings. These stories are still ranked live, but marked as premium in the feed.
          </AppText>
          <View style={styles.list}>
            {access.lockedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onToggleSaved={toggleSaved}
                premium
                saveDisabled={!story.isSaved && access.savedStoriesAtLimit}
              />
            ))}
          </View>
        </SectionCard>
      ) : null}
    </Screen>
  );
}

function readingModeLabel(readingMode: ReadingMode) {
  if (readingMode === 'Concise') return 'Reading mode · Concise scan';
  if (readingMode === 'Deep dive') return 'Reading mode · Deep dive';
  return 'Reading mode · Standard';
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  modePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  modePillText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  topicChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
  outlookRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  editorNoteCard: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  signalIntelStack: {
    gap: spacing.md,
  },
  signalIntelCard: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlookPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },
  outlookPillText: {
    color: colors.accent,
    textTransform: 'none',
    letterSpacing: 0,
  },
  primaryCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
  primaryCtaPressed: {
    opacity: 0.9,
  },
  primaryCtaLabel: {
    color: colors.surface,
    fontWeight: '600',
  },
  lensTokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  lensToken: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  lensTokenText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
  },
  resumeCard: {
    padding: spacing.xl,
    borderRadius: 28,
    backgroundColor: colors.text,
    gap: spacing.sm,
    shadowColor: '#161412',
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },
  pressedCard: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  resumeMeta: {
    color: colors.surfaceMuted,
  },
  resumeTitle: {
    color: colors.surface,
  },
  resumeBody: {
    color: colors.surfaceMuted,
  },
  upNextList: {
    gap: spacing.md,
  },
  upNextRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  pressedRow: {
    opacity: 0.78,
  },
  upNextIndex: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upNextIndexText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
  },
  upNextCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  themeList: {
    gap: spacing.md,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  themeCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  sessionGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sessionMetric: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.xs,
  },
  list: {
    gap: spacing.lg,
  },
});
