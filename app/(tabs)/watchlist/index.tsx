import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { watchlistSuggestions } from '@/src/fixtures/story-feed';
import { useAppStore } from '@/src/store/useAppStore';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { useBriefing } from '@/src/features/briefing/useBriefing';

function TokenRow({ items, tone = 'muted' }: { items: string[]; tone?: 'muted' | 'accent' | 'danger' }) {
  if (!items.length) return null;

  return (
    <View style={styles.wrap}>
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

export default function WatchlistRoute() {
  const watchTokens = useAppStore((state) => state.watchTokens);
  const toggleWatchToken = useAppStore((state) => state.toggleWatchToken);
  const { watchlist, rankedStories } = useBriefing();
  const activeWatchlist = watchlist.filter((item) => item.count > 0);
  const blindSpots = watchlist.filter((item) => item.count === 0);
  const suggestions = watchlistSuggestions.filter((token) => !watchTokens.includes(token)).slice(0, 8);
  const strongest = activeWatchlist[0];
  const matchedStories = rankedStories.filter((story) =>
    watchTokens.some((token) => story.watchTokens.some((item) => item.toLowerCase().includes(token.toLowerCase()))),
  );

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="hero">Following</AppText>
        <AppText variant="body">
          Keep up with the companies, technologies, and policy areas you care about most.
        </AppText>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <AppText variant="caption">Following</AppText>
          <AppText variant="section">{watchTokens.length}</AppText>
          <AppText variant="bodySmall">Items you want Second Order to keep in view.</AppText>
        </View>
        <View style={styles.metricCard}>
          <AppText variant="caption">Stories matched</AppText>
          <AppText variant="section">{matchedStories.length}</AppText>
          <AppText variant="bodySmall">Current stories tied to the names and areas you follow.</AppText>
        </View>
      </View>

      <SectionCard eyebrow="Following" title="What you follow">
        {watchTokens.length ? (
          <View style={styles.wrap}>
            {watchTokens.map((token) => (
              <Chip key={token} label={token} active onPress={() => toggleWatchToken(token)} />
            ))}
          </View>
        ) : (
          <AppText variant="bodySmall">You are not following anything yet. Add a few names or topics below.</AppText>
        )}
      </SectionCard>

      {strongest ? (
        <SectionCard eyebrow="Top signal" title={strongest.token}>
          <View style={styles.heroMeta}>
            <View style={styles.scorePill}>
              <AppText variant="caption" style={styles.scorePillText}>
                {strongest.average}/99 average fit
              </AppText>
            </View>
            <AppText variant="bodySmall">{strongest.count} related {strongest.count === 1 ? 'story' : 'stories'}</AppText>
          </View>
          <AppText variant="body">Status: {strongest.strongestReason}.</AppText>
          <AppText variant="bodySmall">Lead story: {strongest.strongestTitle}</AppText>
          <View style={styles.intelStack}>
            <View style={styles.intelBlock}>
              <AppText variant="caption">Who may benefit</AppText>
              <TokenRow items={strongest.beneficiaries} tone="accent" />
            </View>
            <View style={styles.intelBlock}>
              <AppText variant="caption">Who may face pressure</AppText>
              <TokenRow items={strongest.pressurePoints} tone="danger" />
            </View>
            <View style={styles.intelBlock}>
              <AppText variant="caption">What to watch next</AppText>
              <TokenRow items={strongest.watchItems} />
            </View>
          </View>
          <Pressable
            onPress={() => router.push(`/story/${strongest.strongestStoryId}`)}
            style={({ pressed }) => [styles.primaryCta, pressed && styles.ctaPressed]}>
            <AppText variant="body" style={styles.primaryCtaLabel}>
              Open lead story
            </AppText>
          </Pressable>
        </SectionCard>
      ) : null}

      {activeWatchlist.length ? (
        <SectionCard eyebrow="Updates" title="What each followed item is surfacing right now">
          <View style={styles.radarList}>
            {activeWatchlist.map((item) => (
              <Pressable
                key={item.token}
                onPress={() => item.strongestStoryId && router.push(`/story/${item.strongestStoryId}`)}
                style={({ pressed }) => [styles.radarCard, pressed && item.strongestStoryId ? styles.radarCardPressed : null]}>
                <View style={styles.radarHeader}>
                  <View style={styles.radarCopy}>
                    <AppText variant="body">{item.token}</AppText>
                    <AppText variant="bodySmall">{item.strongestTopic}</AppText>
                  </View>
                  <View style={styles.radarCount}>
                    <AppText variant="caption" style={styles.radarCountText}>
                      {item.count}
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodySmall">Status: {item.strongestReason}.</AppText>
                <AppText variant="bodySmall">What to watch: {item.watchItems.join(' · ')}</AppText>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      ) : null}

      {blindSpots.length ? (
        <SectionCard eyebrow="Still waiting" title="Followed items without a mapped story yet">
          <AppText variant="bodySmall">
            These are worth tracking, but the current story set does not connect them to a live story yet.
          </AppText>
          <TokenRow items={blindSpots.map((item) => item.token)} />
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Suggestions" title="Add a few more to your Following list">
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
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
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
  intelStack: {
    gap: spacing.md,
  },
  intelBlock: {
    gap: spacing.sm,
  },
  wrap: {
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
  primaryCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
  primaryCtaLabel: {
    color: colors.surface,
    fontWeight: '600',
  },
  ctaPressed: {
    opacity: 0.88,
  },
  radarList: {
    gap: spacing.md,
  },
  radarCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  radarCardPressed: {
    opacity: 0.84,
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  radarCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  radarCount: {
    minWidth: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  radarCountText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
  },
});