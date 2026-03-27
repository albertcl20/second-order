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

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="caption">{label}</AppText>
      {children}
    </View>
  );
}

function SignalCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.signalCard}>
      <AppText variant="caption">{label}</AppText>
      <AppText variant="section">{value}</AppText>
      <AppText variant="bodySmall">Signal strength</AppText>
    </View>
  );
}

export function StoryDetailScreen({ story }: { story: RankedStory }) {
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const toggleWatchToken = useAppStore((state) => state.toggleWatchToken);
  const watchTokens = useAppStore((state) => state.watchTokens);
  const { rankedStories } = useBriefing();
  const relatedStories = rankedStories
    .filter((item) => item.id !== story.id)
    .sort((left, right) => {
      const leftSharedTopic = Number(left.topic === story.topic);
      const rightSharedTopic = Number(right.topic === story.topic);
      return rightSharedTopic - leftSharedTopic || right.relevanceScore - left.relevanceScore;
    })
    .slice(0, 2);
  const strongestSignal = Object.entries(story.signals).sort((a, b) => b[1] - a[1])[0];

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
        <AppText variant="body">{story.summary}</AppText>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          onPress={() => toggleSaved(story.id)}
          style={({ pressed }) => [styles.primaryAction, story.isSaved && styles.primaryActionSaved, pressed && styles.primaryActionPressed]}>
          <AppText variant="body" style={styles.primaryActionLabel}>
            {story.isSaved ? 'Saved to desk' : 'Save to desk'}
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: '/modal/source-sheet', params: { storyId: story.id } })}
          style={({ pressed }) => [styles.secondaryAction, pressed && styles.secondaryActionPressed]}>
          <AppText variant="bodySmall" style={styles.secondaryActionLabel}>
            Review sources
          </AppText>
        </Pressable>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <AppText variant="caption">Relevance</AppText>
          <AppText variant="section">{story.relevanceScore}/99</AppText>
          <AppText variant="bodySmall">Ranked against your current lens.</AppText>
        </View>
        <View style={styles.summaryCard}>
          <AppText variant="caption">Strongest signal</AppText>
          <AppText variant="section">{formatSignalLabel(strongestSignal[0])}</AppText>
          <AppText variant="bodySmall">{strongestSignal[1]}/100 intensity.</AppText>
        </View>
      </View>

      <View style={styles.trustCard}>
        <View style={styles.trustHeader}>
          <AppText variant="caption">Trust cues</AppText>
          <Link href="/settings/methodology" asChild>
            <Pressable>
              <AppText variant="bodySmall" style={styles.inlineLink}>
                Open methodology
              </AppText>
            </Pressable>
          </Link>
        </View>
        <View style={styles.trustGrid}>
          <View style={styles.trustPanel}>
            <AppText variant="body" style={styles.trustTitle}>
              Reporting
            </AppText>
            <AppText variant="bodySmall">What happened is grounded in the source set and dated event context.</AppText>
          </View>
          <View style={styles.trustPanel}>
            <AppText variant="body" style={styles.trustTitle}>
              Inference
            </AppText>
            <AppText variant="bodySmall">Why it matters and what happens next are explicit judgment calls, not disguised facts.</AppText>
          </View>
        </View>
      </View>

      <View style={styles.confidenceBanner}>
        <AppText variant="caption">Why this matters to you</AppText>
        <AppText variant="body">{story.analysis.whyItMatters}</AppText>
        <View style={styles.tagWrap}>
          {story.relevanceReasons.map((reason) => (
            <Chip key={reason} label={reason} active />
          ))}
        </View>
      </View>

      <Section label="At a glance">
        <View style={styles.glanceRow}>
          <View style={styles.glanceCard}>
            <AppText variant="caption">Beneficiaries</AppText>
            <AppText variant="section">{story.analysis.whoBenefits.length}</AppText>
            <AppText variant="bodySmall">Likely winners called out</AppText>
          </View>
          <View style={styles.glanceCard}>
            <AppText variant="caption">Watch items</AppText>
            <AppText variant="section">{story.analysis.whatToWatch.length}</AppText>
            <AppText variant="bodySmall">Signals to keep tracking</AppText>
          </View>
        </View>
      </Section>

      <Section label="Signal map">
        <View style={styles.signalGrid}>
          <SignalCard label="Market" value={story.signals.market} />
          <SignalCard label="Product" value={story.signals.product} />
          <SignalCard label="Risk" value={story.signals.operatingRisk} />
          <SignalCard label="Distribution" value={story.signals.distribution} />
        </View>
      </Section>

      <Section label="Add to watchlist">
        <View style={styles.tagWrap}>
          {story.watchTokens.map((token) => (
            <Chip
              key={token}
              label={token}
              active={watchTokens.includes(token)}
              onPress={() => toggleWatchToken(token)}
            />
          ))}
        </View>
      </Section>

      <Section label="Confidence / uncertainty">
        <View style={styles.confidenceBanner}>
          <View style={styles.confidenceHeader}>
            <View style={[styles.confidencePill, styleConfidencePill(story.analysis.confidence)]}>
              <AppText variant="bodySmall" style={styles.confidencePillText}>
                {story.analysis.confidence}
              </AppText>
            </View>
            <AppText variant="bodySmall">{story.sources.length} sources linked</AppText>
          </View>
          <AppText variant="bodySmall">{story.analysis.uncertainty}</AppText>
        </View>
      </Section>

      <Section label="What happened">
        <AppText variant="body">{story.analysis.whatHappened}</AppText>
      </Section>

      <Section label="Why it matters">
        <AppText variant="body">{story.analysis.whyItMatters}</AppText>
      </Section>

      <Section label="Who benefits">
        <BulletList items={story.analysis.whoBenefits} />
      </Section>

      <Section label="Who loses">
        <BulletList items={story.analysis.whoLoses} />
      </Section>

      <Section label="What happens next">
        <BulletList items={story.analysis.whatHappensNext} />
      </Section>

      <Section label="What to watch">
        <BulletList items={story.analysis.whatToWatch} />
      </Section>

      <Section label="Opportunity / risk">
        <View style={styles.opportunityCard}>
          <AppText variant="body">{story.analysis.opportunityRisk}</AppText>
        </View>
      </Section>

      {relatedStories.length ? (
        <Section label="Keep reading">
          <View style={styles.relatedList}>
            {relatedStories.map((relatedStory) => (
              <StoryCard key={relatedStory.id} story={relatedStory} onToggleSaved={toggleSaved} />
            ))}
          </View>
        </Section>
      ) : null}

      <Section label="Sources">
        <View style={styles.sourcesHeader}>
          <AppText variant="bodySmall">Primary references and reporting used in this mock briefing.</AppText>
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

function formatSignalLabel(signal: string) {
  if (signal === 'operatingRisk') return 'Risk';
  return `${signal.charAt(0).toUpperCase()}${signal.slice(1)}`;
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
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
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
  glanceRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  glanceCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  signalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  signalCard: {
    minWidth: '47%',
    flexGrow: 1,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  opportunityCard: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
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
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  relatedList: {
    gap: spacing.lg,
  },
});