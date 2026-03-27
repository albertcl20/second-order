import { useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { validatedStories } from '@/src/fixtures/story-feed';
import { colors, radius, spacing } from '@/src/theme/tokens';

export default function SourceSheetRoute() {
  const { storyId } = useLocalSearchParams<{ storyId?: string }>();
  const story = validatedStories.find((item) => item.id === storyId);

  if (!story) {
    return (
      <Screen scroll>
        <AppText variant="title">Source review unavailable</AppText>
        <AppText variant="bodySmall">This story could not be found in the current preview data.</AppText>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="caption">Source review</AppText>
        <AppText variant="title">{story.title}</AppText>
        <AppText variant="bodySmall">
          Reporting stays separate from inference. Use this sheet to inspect the underlying references before accepting the implication layer.
        </AppText>
      </View>

      <SectionCard eyebrow="Reporting baseline" title="What the sources should establish">
        <AppText variant="bodySmall">The source set should support the event itself, key claims in the summary, and any factual constraints behind the analysis.</AppText>
      </SectionCard>

      <SectionCard eyebrow="Inference layer" title="What still requires judgment">
        <AppText variant="bodySmall">
          Why it matters, winners and losers, next-step implications, and opportunity framing are analytical outputs. They should be plausible, explicit, and easy to challenge.
        </AppText>
      </SectionCard>

      <View style={styles.list}>
        {story.sources.map((source, index) => (
          <Pressable key={source.url} onPress={() => Linking.openURL(source.url)} style={({ pressed }) => [styles.sourceCard, pressed && styles.sourceCardPressed]}>
            <View style={styles.sourceHeader}>
              <View style={styles.indexPill}>
                <AppText variant="caption" style={styles.indexText}>
                  {index + 1}
                </AppText>
              </View>
              <AppText variant="bodySmall">Primary reference</AppText>
            </View>
            <AppText variant="body" style={styles.sourceTitle}>
              {source.label}
            </AppText>
            <AppText variant="bodySmall">{source.url.replace('https://', '')}</AppText>
            <View style={styles.openRow}>
              <AppText variant="bodySmall">Open source</AppText>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  sourceCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  sourceCardPressed: {
    opacity: 0.82,
  },
  sourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  indexPill: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  indexText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
  },
  sourceTitle: {
    fontWeight: '600',
  },
  openRow: {
    paddingTop: spacing.xs,
  },
});