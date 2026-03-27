import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { useBriefing } from '@/src/features/briefing/useBriefing';

function TokenRow({ items, tone = 'muted' }: { items: string[]; tone?: 'muted' | 'accent' | 'danger' }) {
  if (!items.length) return null;

  return (
    <View style={styles.tokenRow}>
      {items.map((item) => (
        <View
          key={item}
          style={[
            styles.token,
            tone === 'accent' && styles.tokenAccent,
            tone === 'danger' && styles.tokenDanger,
          ]}>
          <AppText
            variant="caption"
            style={[
              styles.tokenText,
              tone === 'accent' && styles.tokenTextAccent,
              tone === 'danger' && styles.tokenTextDanger,
            ]}>
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export default function ThemesRoute() {
  const { themes } = useBriefing();
  const strongest = themes[0];

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="hero">Themes</AppText>
        <AppText variant="body">
          Grouped clusters of stories by topic and shift — so you can see where consequences are compounding, not just which headline won the day.
        </AppText>
      </View>

      {strongest ? (
        <SectionCard eyebrow="Top narrative" title={strongest.label}>
          <View style={styles.topThemeMeta}>
            <View style={styles.scorePill}>
              <AppText variant="caption" style={styles.scorePillText}>
                {strongest.average}/99 relevance
              </AppText>
            </View>
            <AppText variant="bodySmall">{strongest.count} linked {strongest.count === 1 ? 'story' : 'stories'}</AppText>
          </View>
          <AppText variant="body">Strongest entry: {strongest.strongest}</AppText>
          <AppText variant="bodySmall">Why it keeps rising: {strongest.strongestReason}.</AppText>
        </SectionCard>
      ) : null}

      {themes.map((theme) => (
        <SectionCard key={theme.label} eyebrow={`${theme.count} story ${theme.count > 1 ? 'cluster' : 'signal'}`} title={theme.label}>
          <View style={styles.themeHeader}>
            <View style={styles.themeMetric}>
              <AppText variant="caption">Average relevance</AppText>
              <AppText variant="section">{theme.average}/99</AppText>
            </View>
            <View style={styles.themeMetric}>
              <AppText variant="caption">Lead briefing</AppText>
              <AppText variant="bodySmall">{theme.strongest}</AppText>
            </View>
          </View>

          <View style={styles.insightStack}>
            <View style={styles.insightBlock}>
              <AppText variant="caption">Why this cluster matters</AppText>
              <AppText variant="bodySmall">Second Order is seeing the strongest pull here from {theme.strongestReason}.</AppText>
            </View>

            <View style={styles.insightBlock}>
              <AppText variant="caption">Watchlist drivers</AppText>
              <TokenRow items={theme.watchDrivers} tone="accent" />
            </View>

            <View style={styles.twoUp}>
              <View style={styles.insightCard}>
                <AppText variant="caption">Likely beneficiaries</AppText>
                <TokenRow items={theme.benefitDrivers} />
              </View>
              <View style={styles.insightCard}>
                <AppText variant="caption">Likely pressure points</AppText>
                <TokenRow items={theme.riskDrivers} tone="danger" />
              </View>
            </View>

            <View style={styles.insightBlock}>
              <AppText variant="caption">What to keep watching</AppText>
              <TokenRow items={theme.watchSignals} />
            </View>
          </View>

          <Pressable
            onPress={() => router.push(`/story/${theme.strongestStoryId}`)}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
            <AppText variant="body" style={styles.ctaLabel}>
              Open lead briefing
            </AppText>
          </Pressable>
        </SectionCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
  },
  topThemeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  scorePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },
  scorePillText: {
    color: colors.accent,
    textTransform: 'none',
    letterSpacing: 0,
  },
  themeHeader: {
    gap: spacing.md,
  },
  themeMetric: {
    gap: spacing.xs,
  },
  insightStack: {
    gap: spacing.md,
  },
  insightBlock: {
    gap: spacing.sm,
  },
  twoUp: {
    gap: spacing.md,
  },
  insightCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  tokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  token: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  tokenAccent: {
    backgroundColor: colors.accentSoft,
  },
  tokenDanger: {
    backgroundColor: '#F6E1E1',
  },
  tokenText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
  },
  tokenTextAccent: {
    color: colors.accent,
  },
  tokenTextDanger: {
    color: colors.danger,
  },
  cta: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaLabel: {
    color: colors.surface,
    fontWeight: '600',
  },
});
