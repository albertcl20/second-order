import { format } from 'date-fns';
import { Link, router } from 'expo-router';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { StoryCard } from '@/src/components/ui/StoryCard';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { RankedStory } from '@/src/lib/story-intelligence';
import { useAppStore } from '@/src/store/useAppStore';
import { useBriefing } from '@/src/features/briefing/useBriefing';
import { ReactNode, useEffect, useState } from 'react';
import { getStoryDecisionSummary } from '@/src/lib/story-intelligence';

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item} style={styles.listItem}>
          <View style={styles.dot} />
          <AppText variant="body">{item}</AppText>
        </View>
      ))}
    </View>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="caption">{label}</AppText>
      {children}
    </View>
  );
}

function ExpandableSection({
  label,
  preview,
  initiallyExpanded = false,
  children,
}: {
  label: string;
  preview: string;
  initiallyExpanded?: boolean;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  useEffect(() => {
    setExpanded(initiallyExpanded);
  }, [initiallyExpanded]);

  return (
    <View style={styles.expandableSection}>
      <Pressable onPress={() => setExpanded((value) => !value)} style={({ pressed }) => [styles.expandableHeader, pressed && styles.expandablePressed]}>
        <View style={styles.expandableCopy}>
          <AppText variant="caption">{label}</AppText>
          <AppText variant="bodySmall" style={styles.expandablePreview}>{preview}</AppText>
        </View>
        <AppText variant="bodySmall" style={styles.expandableAction}>{expanded ? 'Hide' : 'Show'}</AppText>
      </Pressable>
      {expanded ? <View style={styles.expandableBody}>{children}</View> : null}
    </View>
  );
}

export function StoryDetailScreen({ story }: { story: RankedStory }) {
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const toggleWatchToken = useAppStore((state) => state.toggleWatchToken);
  const watchTokens = useAppStore((state) => state.watchTokens);
  const readingMode = useAppStore((state) => state.readingMode);
  const { rankedStories, preferences } = useBriefing();
  const relatedStories = rankedStories.filter((item) => item.id !== story.id && item.topic === story.topic).slice(0, 2);
  const confidenceLabel = mapConfidence(story.analysis.confidence);
  const decision = getStoryDecisionSummary(story, preferences);
  const showDecisionView = readingMode !== 'Concise';
  const expandDeepSections = readingMode === 'Deep dive';

  return (
    <Screen scroll>
      <View style={styles.top}>
        <AppText variant="caption">{story.kicker}</AppText>
        <View style={styles.headerMeta}>
          <View style={styles.headerBadge}>
            <AppText variant="bodySmall">{story.topic}</AppText>
          </View>
          <AppText variant="bodySmall">{format(new Date(story.publishedAt), 'd MMM yyyy')}</AppText>
          <AppText variant="bodySmall">{story.readingTime} min</AppText>
        </View>
        <AppText variant="title">{story.title}</AppText>
      </View>

      <View style={styles.oneLineCard}>
        <AppText variant="caption">In one line</AppText>
        <AppText variant="body">{story.summary}</AppText>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          onPress={() => toggleSaved(story.id)}
          style={({ pressed }) => [styles.primaryAction, story.isSaved && styles.primaryActionSaved, pressed && styles.primaryActionPressed]}>
          <AppText variant="body" style={styles.primaryActionLabel}>
            {story.isSaved ? 'Saved' : 'Save'}
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: '/modal/source-sheet', params: { storyId: story.id } })}
          style={({ pressed }) => [styles.secondaryAction, pressed && styles.secondaryActionPressed]}>
          <AppText variant="bodySmall" style={styles.secondaryActionLabel}>
            Sources
          </AppText>
        </Pressable>
      </View>

      <View style={styles.trustCard}>
        <View style={styles.trustHeader}>
          <AppText variant="caption">How to read this</AppText>
          <Link href="/settings/methodology" asChild>
            <Pressable>
              <AppText variant="bodySmall" style={styles.inlineLink}>
                Read the method
              </AppText>
            </Pressable>
          </Link>
        </View>
        <View style={styles.trustGrid}>
          <View style={styles.trustPanel}>
            <AppText variant="body" style={styles.trustTitle}>
              What we know
            </AppText>
            <AppText variant="bodySmall">The basic facts come from the linked reporting and source material.</AppText>
          </View>
          <View style={styles.trustPanel}>
            <AppText variant="body" style={styles.trustTitle}>
              What we think it means
            </AppText>
            <AppText variant="bodySmall">The impact, winners, losers, and next steps are analysis. They are not presented as fact.</AppText>
          </View>
        </View>
      </View>

      <Section label="What happened">
        <AppText variant="body">{story.analysis.whatHappened}</AppText>
      </Section>

      <Section label="Why it matters">
        <AppText variant="body">{story.analysis.whyItMatters}</AppText>
      </Section>

      <Section label="What to watch">
        <BulletList items={story.analysis.whatToWatch} />
      </Section>

      {showDecisionView ? (
        <Section label="Decision view">
          <View style={styles.decisionCard}>
            <View style={styles.decisionHeader}>
              <View style={styles.decisionPill}>
                <AppText variant="bodySmall" style={styles.decisionPillText}>
                  {decision.posture}
                </AppText>
              </View>
              <AppText variant="bodySmall">Based on your current profile and followed topics</AppText>
            </View>
            <AppText variant="body">{decision.postureReason}</AppText>
            <View style={styles.decisionList}>
              <AppText variant="bodySmall">{decision.watchlistLine}</AppText>
              <AppText variant="bodySmall">{decision.actionLine}</AppText>
              <AppText variant="bodySmall">{decision.triggerLine}</AppText>
            </View>
          </View>
        </Section>
      ) : null}

      <ExpandableSection label="Who benefits" preview={story.analysis.whoBenefits[0] ?? 'See likely winners'} initiallyExpanded={expandDeepSections}>
        <BulletList items={story.analysis.whoBenefits} />
      </ExpandableSection>

      <ExpandableSection label="Who loses" preview={story.analysis.whoLoses[0] ?? 'See likely losers'} initiallyExpanded={expandDeepSections}>
        <BulletList items={story.analysis.whoLoses} />
      </ExpandableSection>

      <ExpandableSection label="What happens next" preview={story.analysis.whatHappensNext[0] ?? 'See the next likely move'} initiallyExpanded={expandDeepSections}>
        <BulletList items={story.analysis.whatHappensNext} />
      </ExpandableSection>

      <ExpandableSection label="Opportunity / risk" preview={story.analysis.opportunityRisk} initiallyExpanded={expandDeepSections}>
        <View style={styles.opportunityCard}>
          <AppText variant="body">{story.analysis.opportunityRisk}</AppText>
        </View>
      </ExpandableSection>

      <Section label="Confidence and uncertainty">
        <View style={styles.confidenceBanner}>
          <View style={styles.confidenceHeader}>
            <View style={[styles.confidencePill, styleConfidencePill(story.analysis.confidence)]}>
              <AppText variant="bodySmall" style={styles.confidencePillText}>
                {confidenceLabel}
              </AppText>
            </View>
            <AppText variant="bodySmall">{story.sources.length} sources linked</AppText>
          </View>
          <AppText variant="bodySmall">{story.analysis.uncertainty}</AppText>
        </View>
      </Section>

      <Section label="Follow this story">
        <View style={styles.tagWrap}>
          {story.watchTokens.map((token) => (
            <Chip key={token} label={token} active={watchTokens.includes(token)} onPress={() => toggleWatchToken(token)} />
          ))}
        </View>
      </Section>

      {relatedStories.length ? (
        <Section label="Related stories">
          <View style={styles.relatedList}>
            {relatedStories.map((relatedStory) => (
              <StoryCard key={relatedStory.id} story={relatedStory} onToggleSaved={toggleSaved} />
            ))}
          </View>
        </Section>
      ) : null}

      <Section label="Sources">
        <View style={styles.sourcesHeader}>
          <AppText variant="bodySmall">Open the source set if you want to check the reporting behind this story.</AppText>
        </View>
        <View style={styles.sources}>
          {story.sources.map((source) => (
            <Pressable key={source.url} onPress={() => Linking.openURL(source.url)} style={styles.sourceRow}>
              <View style={styles.sourceCopy}>
                <AppText variant="body">{source.label}</AppText>
                <AppText variant="bodySmall">{source.url.replace('https://', '')}</AppText>
              </View>
              <AppText variant="bodySmall">Open</AppText>
            </Pressable>
          ))}
        </View>
      </Section>
    </Screen>
  );
}

function mapConfidence(confidence: string) {
  if (confidence === 'High confidence') return 'High confidence';
  if (confidence === 'Plausible') return 'Medium confidence';
  return 'Low confidence';
}

function styleConfidencePill(confidence: string) {
  if (confidence === 'High confidence') {
    return { backgroundColor: '#DFF4E7' };
  }

  if (confidence === 'Plausible') {
    return { backgroundColor: '#F7E6C9' };
  }

  return { backgroundColor: '#E7E0F8' };
}

const styles = StyleSheet.create({
  top: {
    gap: spacing.md,
  },
  headerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  oneLineCard: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  primaryAction: {
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryActionSaved: {
    backgroundColor: colors.accent,
  },
  primaryActionPressed: {
    opacity: 0.86,
  },
  primaryActionLabel: {
    color: colors.surface,
    fontWeight: '600',
  },
  secondaryAction: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  secondaryActionPressed: {
    opacity: 0.8,
  },
  secondaryActionLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  trustCard: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  trustHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  inlineLink: {
    color: colors.accent,
    fontWeight: '600',
  },
  trustGrid: {
    gap: spacing.md,
  },
  trustPanel: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  trustTitle: {
    fontWeight: '700',
  },
  section: {
    gap: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.text,
    marginTop: 8,
  },
  expandableSection: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  expandablePressed: {
    opacity: 0.82,
  },
  expandableCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  expandablePreview: {
    color: colors.textSecondary,
  },
  expandableAction: {
    color: colors.text,
    fontWeight: '600',
  },
  expandableBody: {
    paddingTop: spacing.xs,
  },
  opportunityCard: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  decisionCard: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  decisionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    alignItems: 'center',
  },
  decisionPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accentSoft,
  },
  decisionPillText: {
    color: colors.accent,
    fontWeight: '700',
  },
  decisionList: {
    gap: spacing.sm,
  },
  confidenceBanner: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.sm,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  confidencePill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  confidencePillText: {
    color: colors.text,
    fontWeight: '700',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  relatedList: {
    gap: spacing.lg,
  },
  sourcesHeader: {
    paddingHorizontal: spacing.xs,
  },
  sources: {
    gap: spacing.sm,
  },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  sourceCopy: {
    flex: 1,
    gap: spacing.xs,
  },
});
