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
        <AppText variant="hero">Topics</AppText>
        <AppText variant="body">
          Browse the areas shaping the day, then open the stories that explain why they matter and what may change next.
        </AppText>
      </View>

      {!access.isPremium ? (
        <SectionCard eyebrow="Free topics" title={`Free includes ${access.freeThemeLimit} topic pages`}>
          <AppText variant="bodySmall">
            Premium unlocks the full topic set, so you can follow more than the two biggest areas each day.
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
        <SectionCard eyebrow="Leading topic" title={strongest.label}>
          <View style={styles.topThemeMeta}>
            <View style={styles.scorePill}>
              <AppText variant="caption" style={styles.scorePillText}>
                {strongest.average}/99 average fit
              </AppText>
            </View>
            <AppText variant="bodySmall">{strongest.count} related {strongest.count === 1 ? 'story' : 'stories'}</AppText>
          </View>
          <AppText variant="body">Why this topic matters now: {strongest.strongestReason}.</AppText>
          <AppText variant="bodySmall">Start with: {strongest.strongest}</AppText>
        </SectionCard>
      ) : null}

      {access.visibleThemes.map((theme) => {
        const isSaved = savedThemeLabels.includes(theme.label);

        return (
          <SectionCard key={theme.label} eyebrow={`${theme.count} ${theme.count === 1 ? 'story' : 'stories'}`} title={theme.label}>
            <View style={styles.themeHeader}>
              <View style={styles.themeMetric}>
                <AppText variant="caption">Why this topic matters now</AppText>
                <AppText variant="bodySmall">{theme.strongestReason}.</AppText>
              </View>
              <View style={styles.themeMetric}>
                <AppText variant="caption">Lead story</AppText>
                <AppText variant="bodySmall">{theme.strongest}</AppText>
              </View>
            </View>

            <View style={styles.insightStack}>
              <View style={styles.insightBlock}>
                <AppText variant="caption">Who may benefit</AppText>
                <TokenRow items={theme.benefitDrivers} tone="accent" />
              </View>

              <View style={styles.insightBlock}>
                <AppText variant="caption">Who may face pressure</AppText>
                <TokenRow items={theme.riskDrivers} tone="danger" />
              </View>

              <View style={styles.insightBlock}>
                <AppText variant="caption">What to watch next</AppText>
                <TokenRow items={theme.watchSignals} />
              </View>

              <View style={styles.insightBlock}>
                <AppText variant="caption">Related names and ideas</AppText>
                <TokenRow items={theme.watchDrivers} />
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => toggleSavedTheme(theme.label)}
                style={({ pressed }) => [styles.secondaryCta, isSaved && styles.secondaryCtaActive, pressed && styles.ctaPressed]}>
                <AppText variant="bodySmall" style={[styles.secondaryCtaLabel, isSaved && styles.secondaryCtaLabelActive]}>
                  {isSaved ? 'Saved topic' : 'Save topic'}
                </AppText>
              </Pressable>

              <Pressable
                onPress={() => router.push(`/story/${theme.strongestStoryId}`)}
                style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
                <AppText variant="body" style={styles.ctaLabel}>
                  Open lead story
                </AppText>
              </Pressable>
            </View>
          </SectionCard>
        );
      })}

      {access.lockedThemes.length ? (
        <SectionCard eyebrow="More in premium" title="Additional topics below the free line">
          <View style={styles.lockedThemeList}>
            {access.lockedThemes.map((theme) => (
              <View key={theme.label} style={styles.lockedThemeCard}>
                <View style={styles.lockedThemeHeader}>
                  <View style={styles.premiumPill}>
                    <AppText variant="caption" style={styles.premiumPillText}>
                      Premium
                    </AppText>
                  </View>
                  <AppText variant="bodySmall">{theme.average}/99 average fit</AppText>
                </View>
                <AppText variant="body">{theme.label}</AppText>
                <AppText variant="bodySmall">Why it matters now: {theme.strongestReason}.</AppText>
                <AppText variant="bodySmall">What to watch: {theme.watchSignals.join(' · ')}</AppText>
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