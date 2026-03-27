import { format } from 'date-fns';
import { router } from 'expo-router';
import { GestureResponderEvent, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { RankedStory } from '@/src/lib/story-intelligence';

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
  const isCompact = width < 390;
  const isUltraCompact = width < 360;
  const visibleReasons = story.relevanceReasons.slice(0, isUltraCompact ? 2 : 3);
  const hiddenReasons = story.relevanceReasons.length - visibleReasons.length;

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
      <View style={styles.header}>
        <AppText variant="caption" numberOfLines={1} style={styles.kickerText}>{story.kicker}</AppText>
        <View style={styles.headerMetaActions}>
          {premium ? (
            <View style={styles.premiumBadge}>
              <AppText variant="caption" style={styles.premiumBadgeText}>
                Premium
              </AppText>
            </View>
          ) : null}
          <AppText variant="caption" style={styles.readingTimeText}>{story.readingTime} min</AppText>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaBadge}>
          <AppText variant="bodySmall" numberOfLines={1}>{story.topic}</AppText>
        </View>
        <AppText variant="bodySmall">{format(new Date(story.publishedAt), 'd MMM')}</AppText>
      </View>

      <View style={styles.copyBlock}>
        <AppText variant="section" numberOfLines={isCompact ? 2 : 3}>{story.title}</AppText>
        <AppText variant="bodySmall" numberOfLines={isCompact ? 2 : 3}>{story.summary}</AppText>
      </View>

      <View style={[styles.relevanceRow, isCompact && styles.relevanceRowCompact]}>
        <View style={[styles.scoreBubble, isCompact && styles.scoreBubbleCompact]}>
          <AppText variant="caption" style={styles.scoreLabel}>
            {story.relevanceScore}
          </AppText>
          <AppText variant="caption" style={styles.scoreSuffix}>
            fit
          </AppText>
        </View>
        <View style={styles.reasonWrap}>
          {visibleReasons.map((reason) => (
            <Chip key={reason} label={reason} />
          ))}
          {hiddenReasons > 0 ? <Chip label={`+${hiddenReasons} more`} /> : null}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.badge}>
          <AppText variant="caption" numberOfLines={1} style={styles.confidenceText}>{story.analysis.confidence}</AppText>
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
    gap: spacing.sm,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerMetaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  kickerText: {
    flex: 1,
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
  readingTimeText: {
    flexShrink: 0,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaBadge: {
    flexShrink: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  copyBlock: {
    gap: spacing.xs,
  },
  relevanceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  relevanceRowCompact: {
    alignItems: 'flex-start',
  },
  scoreBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
  },
  scoreBubbleCompact: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  scoreLabel: {
    color: colors.accent,
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 14,
  },
  scoreSuffix: {
    color: colors.accent,
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 12,
    fontSize: 10,
  },
  reasonWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.md,
  },
  badge: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },
  confidenceText: {
    color: colors.accent,
    textTransform: 'none',
    letterSpacing: 0,
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
