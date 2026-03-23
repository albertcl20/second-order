import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { RankedStory } from '@/src/lib/story-intelligence';

export function StoryCard({ story, onToggleSaved }: { story: RankedStory; onToggleSaved?: (storyId: string) => void }) {
  return (
    <Pressable onPress={() => router.push(`/story/${story.id}`)} style={styles.card}>
      <View style={styles.header}>
        <AppText variant="caption">{story.kicker}</AppText>
        <AppText variant="caption">{story.readingTime} min</AppText>
      </View>
      <AppText variant="section">{story.title}</AppText>
      <AppText variant="bodySmall">{story.summary}</AppText>

      <View style={styles.relevanceRow}>
        <View style={styles.scoreBubble}>
          <AppText variant="caption" style={styles.scoreLabel}>
            {story.relevanceScore}
          </AppText>
        </View>
        <View style={styles.reasonWrap}>
          {story.relevanceReasons.map((reason) => (
            <Chip key={reason} label={reason} />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.badge}>
          <AppText variant="caption">{story.analysis.confidence}</AppText>
        </View>
        <Pressable onPress={() => onToggleSaved?.(story.id)} hitSlop={10}>
          <AppText variant="bodySmall" style={styles.saveText}>
            {story.isSaved ? 'Saved' : 'Save'}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relevanceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  scoreBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreLabel: {
    color: colors.accent,
    textTransform: 'none',
    letterSpacing: 0,
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
    marginTop: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },
  saveText: {
    color: colors.text,
    fontWeight: '600',
  },
});
