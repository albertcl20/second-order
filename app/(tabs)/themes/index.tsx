import { View, StyleSheet } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { getThemeSummary } from '@/src/lib/story-intelligence';
import { useAppStore } from '@/src/store/useAppStore';
import { spacing } from '@/src/theme/tokens';

export default function ThemesRoute() {
  const savedStoryIds = useAppStore((state) => state.savedStoryIds);
  const watchTokens = useAppStore((state) => state.watchTokens);
  const roleFocus = useAppStore((state) => state.roleFocus);
  const interestFocus = useAppStore((state) => state.interestFocus);

  const themes = getThemeSummary({ savedStoryIds, watchTokens, roleFocus, interestFocus });

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="hero">Themes</AppText>
        <AppText variant="body">Persistent narratives ranked by how relevant they are to your current lens.</AppText>
      </View>

      {themes.map((theme) => (
        <SectionCard key={theme.label} eyebrow={`${theme.count} story ${theme.count > 1 ? 'cluster' : 'signal'}`} title={theme.label}>
          <AppText variant="bodySmall">Average relevance: {theme.average}/99</AppText>
          <AppText variant="body">Strongest entry: {theme.strongest}</AppText>
        </SectionCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
  },
});
