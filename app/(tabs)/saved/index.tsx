import { View, StyleSheet } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { StoryCard } from '@/src/components/ui/StoryCard';
import { getSavedStories } from '@/src/lib/story-intelligence';
import { useAppStore } from '@/src/store/useAppStore';
import { spacing } from '@/src/theme/tokens';

export default function SavedRoute() {
  const savedStoryIds = useAppStore((state) => state.savedStoryIds);
  const watchTokens = useAppStore((state) => state.watchTokens);
  const roleFocus = useAppStore((state) => state.roleFocus);
  const interestFocus = useAppStore((state) => state.interestFocus);
  const toggleSaved = useAppStore((state) => state.toggleSaved);

  const savedStories = getSavedStories({ savedStoryIds, watchTokens, roleFocus, interestFocus });

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="hero">Saved</AppText>
        <AppText variant="body">Your personal desk of stories worth revisiting.</AppText>
      </View>

      {savedStories.length ? (
        <View style={styles.list}>
          {savedStories.map((story) => (
            <StoryCard key={story.id} story={story} onToggleSaved={toggleSaved} />
          ))}
        </View>
      ) : (
        <AppText variant="bodySmall">Nothing saved yet. Save from Today to build your desk.</AppText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.lg,
  },
});
