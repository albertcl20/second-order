import { StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { mockStories } from '@/src/fixtures/stories';
import { useAppStore } from '@/src/store/useAppStore';
import { spacing } from '@/src/theme/tokens';

export default function WatchlistRoute() {
  const watchTokens = useAppStore((state) => state.watchTokens);
  const toggleWatchToken = useAppStore((state) => state.toggleWatchToken);

  const suggestions = [...new Set(mockStories.flatMap((story) => story.watchTokens))];

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="hero">Watchlist</AppText>
        <AppText variant="body">Choose the companies, policy threads, and markets you want the feed to overvalue on purpose.</AppText>
      </View>

      <SectionCard eyebrow="Following" title="Active watchlist">
        <View style={styles.wrap}>
          {watchTokens.map((token) => (
            <Chip key={token} label={token} active onPress={() => toggleWatchToken(token)} />
          ))}
        </View>
      </SectionCard>

      <SectionCard eyebrow="Suggestions" title="Quick adds from current stories">
        <View style={styles.wrap}>
          {suggestions.map((token) => (
            <Chip key={token} label={token} active={watchTokens.includes(token)} onPress={() => toggleWatchToken(token)} />
          ))}
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
