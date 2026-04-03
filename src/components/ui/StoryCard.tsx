import { format } from 'date-fns';
import { router } from 'expo-router';
import { GestureResponderEvent, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { RankedStory } from '@/src/lib/story-intelligence';
import { useAppStore } from '@/src/store/useAppStore';

export function StoryCard({
  story,
  onToggleSaved,
  premium,
  saveDisabled,
}: {
  story: RankedStory;
  onToggleSaved?: (storyId: string) => void;
  premium?: boolean;
  saveDisabled?: boolean;
}) {
  const { width } = useWindowDimensions();
  const readingMode = useAppStore((state) => state.readingMode);
  const isCompact = width < 390;
  const visibleReasons = story.relevanceReasons.slice(0, readingMode === 'Concise' ? 1 : readingMode === 'Deep dive' ? 3 : 2);
  const summaryLines = readingMode === 'Deep dive' ? 3 : 2;
  const titleLines = readingMode === 'Concise' ? 2 : 3;

  const handleSavePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (saveDisabled) return;
    onToggleSaved?.(story.id);
  };

  return (
    <Pressable
      onPress={() => router.push(`/story/${story.id}`)}
      style={({ pressed }) => [
        styles.card,
        isCompact && styles.cardCompact,
        story.isSaved && styles.savedCard,
        premium && styles.premiumCard,
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.topRow}>
        <View style={styles.topicPill}>
          <AppText variant="caption" style={styles.topicText}>
            {story.topic}
          </AppText>
        </View>
        <View style={styles.metaRow}>
          {premium ? (
            <View style={styles.premiumBadge}>
              <AppText variant="caption" style={styles.premiumBadgeText}>
                Premium
              </AppText>
            </View>
          ) : null}
          <AppText variant="bodySmall" style={styles.metaText}>
            {format(new Date(story.publishedAt), 'd MMM')}
          </AppText>
          <AppText variant="bodySmall" style={styles.metaText}>
            {story.readingTime} min
          </AppText>
        </View>
      </View>

      <View style={styles.copyBlock}>
        <AppText variant="section" numberOfLines={titleLines}>
          {story.title}
        </AppText>
        <View style={styles.whyBlock}>
          <AppText variant="caption" style={styles.whyLabel}>
            Why this matters
          </AppText>
          <AppText variant="bodySmall" numberOfLines={summaryLines} style={styles.summaryText}>
            {story.summary}
          </AppText>
        </View>
      </View>

      <View style={styles.chipRow}>
        {visibleReasons.map((reason) => (
          <Chip key={reason} label={reason} />
        ))}
      </View>

      <View style={styles.footer}>
        <View style={[styles.confidencePill, confidenceStyle(story.analysis.confidence)]}>
          <AppText variant="caption" style={styles.confidenceText}>
            {mapConfidence(story.analysis.confidence)}
          </AppText>
        </View>
        <Pressable
          onPress={handleSavePress}
          disabled={saveDisabled}
          hitSlop={10}
          style={({ pressed }) => [
            styles.saveAction,
            story.isSaved && styles.saveActionActive,
            saveDisabled && styles.saveActionDisabled,
            pressed && styles.saveActionPressed,
          ]}>
          <AppText variant="bodySmall" style={[styles.saveText, saveDisabled && styles.saveTextDisabled]}>
            {story.isSaved ? 'Saved' : saveDisabled ? 'Limit reached' : 'Save'}
          </AppText>
        </Pressable>
      </View>
    </Pressable>
  );
}

function mapConfidence(confidence: string) {
  if (confidence === 'High confidence') return 'High confidence';
  if (confidence === 'Plausible') return 'Medium confidence';
  return 'Low confidence';
}

function confidenceStyle(confidence: string) {
  if (confidence === 'High confidence') return { backgroundColor: '#DFF4E7' };
  if (confidence === 'Plausible') return { backgroundColor: '#F7E6C9' };
  return { backgroundColor: '#E7E0F8' };
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#161412',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardCompact: {
    padding: spacing.lg,
  },
  savedCard: {
    borderColor: colors.accent,
  },
  premiumCard: {
    borderColor: '#D8BE7A',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  topicPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  topicText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  metaText: {
    color: colors.textSecondary,
  },
  premiumBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#FAF1D8',
  },
  premiumBadgeText: {
    color: colors.warning,
    textTransform: 'none',
    letterSpacing: 0,
  },
  copyBlock: {
    gap: spacing.md,
  },
  whyBlock: {
    gap: spacing.xs,
  },
  whyLabel: {
    color: colors.textSecondary,
    textTransform: 'none',
    letterSpacing: 0,
    fontWeight: '700',
  },
  summaryText: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  confidencePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  confidenceText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
    fontWeight: '700',
  },
  saveAction: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  saveActionActive: {
    backgroundColor: colors.accentSoft,
  },
  saveActionDisabled: {
    backgroundColor: '#F1ECE4',
  },
  saveActionPressed: {
    opacity: 0.82,
  },
  saveText: {
    color: colors.text,
    fontWeight: '600',
  },
  saveTextDisabled: {
    color: colors.textSecondary,
  },
});