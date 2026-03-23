import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { RankedStory } from '@/src/lib/story-intelligence';
import { useAppStore } from '@/src/store/useAppStore';

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

export function StoryDetailScreen({ story }: { story: RankedStory }) {
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const toggleWatchToken = useAppStore((state) => state.toggleWatchToken);

  return (
    <Screen scroll>
      <View style={styles.top}>
        <AppText variant="caption">{story.kicker}</AppText>
        <AppText variant="title">{story.title}</AppText>
        <AppText variant="body">{story.summary}</AppText>
      </View>

      <View style={styles.actionRow}>
        <Pressable onPress={() => toggleSaved(story.id)} style={styles.primaryAction}>
          <AppText variant="body" style={styles.primaryActionLabel}>
            {story.isSaved ? 'Saved to desk' : 'Save to desk'}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.confidenceBanner}>
        <AppText variant="caption">Why this matters to you</AppText>
        <AppText variant="body">Relevance score: {story.relevanceScore}/99</AppText>
        <View style={styles.tagWrap}>
          {story.relevanceReasons.map((reason) => (
            <Chip key={reason} label={reason} active />
          ))}
        </View>
      </View>

      <Section label="Add to watchlist">
        <View style={styles.tagWrap}>
          {story.watchTokens.map((token) => (
            <Chip key={token} label={token} onPress={() => toggleWatchToken(token)} />
          ))}
        </View>
      </Section>

      <Section label="Confidence">
        <View style={styles.confidenceBanner}>
          <AppText variant="body">{story.analysis.confidence}</AppText>
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
        <AppText variant="body">{story.analysis.opportunityRisk}</AppText>
      </Section>

      <Section label="Sources">
        <View style={styles.sources}>
          {story.sources.map((source) => (
            <Pressable key={source.url} onPress={() => Linking.openURL(source.url)} style={styles.sourceRow}>
              <AppText variant="body">{source.label}</AppText>
              <AppText variant="bodySmall">Open</AppText>
            </Pressable>
          ))}
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    gap: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
  },
  primaryAction: {
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryActionLabel: {
    color: colors.surface,
    fontWeight: '600',
  },
  confidenceBanner: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.xs,
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
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
