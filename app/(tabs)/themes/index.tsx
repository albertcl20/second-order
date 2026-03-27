import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { useBriefing } from '@/src/features/briefing/useBriefing';
import { useAppStore } from '@/src/store/useAppStore';

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
  const { themes, access } = useBriefing();
  const savedThemeLabels = useAppStore((state) => state.savedThemeLabels);
  const toggleSavedTheme = useAppStore((state) => state.toggleSavedTheme);
  const setSubscriptionTier = useAppStore((state) => state.setSubscriptionTier);
  const strongest = themes[0];

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="hero">Themes</AppText>
        <AppText variant="body">
          Grouped clusters of stories by topic and shift — so you can see where consequences are compounding, not just which headline won the day.
        </AppText>
      </View>

      {!access.isPremium ? (
        <SectionCard eyebrow="Free themes" title={`Free includes ${access.freeThemeLimit} live theme clusters`}>
          <AppText variant="bodySmall">
            Premium unlocks the full narrative map so the app can track more than the biggest two clusters.
          </AppText>
          <Pressable
            onPress={() => setSubscriptionTier('Premium preview')}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
            <AppText variant="body" style={styles.ctaLabel}>
              Switch to premium preview
            </AppText>
          </Pressable>
        </SectionCard>
      ) : null}

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

      {access.visibleThemes.map((theme) => {
        const isSaved = savedThemeLabels.includes(theme.label);

        return (
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

            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => toggleSavedTheme(theme.label)}
                style={({ pressed }) => [styles.secondaryCta, isSaved && styles.secondaryCtaActive, pressed && styles.ctaPressed]}>
                <AppText variant="bodySmall" style={[styles.secondaryCtaLabel, isSaved && styles.secondaryCtaLabelActive]}>
                  {isSaved ? 'Saved theme' : 'Save theme'}
                </AppText>
              </Pressable>

              <Pressable
                onPress={() => router.push(`/story/${theme.strongestStoryId}`)}
                style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
                <AppText variant="body" style={styles.ctaLabel}>
                  Open lead briefing
                </AppText>
              </Pressable>
            </View>
          </SectionCard>
        );
      })}

      {access.lockedThemes.length ? (
        <SectionCard eyebrow="Premium theme map" title="Additional clusters beyond the free theme layer">
          <View style={styles.lockedThemeList}>
            {access.lockedThemes.map((theme) => (
              <View key={theme.label} style={styles.lockedThemeCard}>
                <View style={styles.lockedThemeHeader}>
                  <View style={styles.premiumPill}>
                    <AppText variant="caption" style={styles.premiumPillText}>
                      Premium
                    </AppText>
                  </View>
                  <AppText variant="bodySmall">{theme.average}/99 relevance</AppText>
                </View>
                <AppText variant="body">{theme.label}</AppText>
                <AppText variant="bodySmall">Lead briefing: {theme.strongest}</AppText>
                <AppText variant="bodySmall">Watch: {theme.watchSignals.join(' · ')}</AppText>
              </View>
            ))}
          </View>
        </SectionCard>
      ) : null}
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
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  secondaryCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryCtaActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  secondaryCtaLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  secondaryCtaLabelActive: {
    color: colors.accent,
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
  lockedThemeList: {
    gap: spacing.md,
  },
  lockedThemeCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: '#FBF7EE',
    borderWidth: 1,
    borderColor: '#E7D7B2',
  },
  lockedThemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  premiumPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: '#FAF1D8',
  },
  premiumPillText: {
    color: colors.warning,
    textTransform: 'none',
    letterSpacing: 0,
  },
});
