import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { SectionCard } from '@/src/components/ui/SectionCard';
import {
  NotificationMode,
  ReadingMode,
  SubscriptionTier,
  useAppStore,
} from '@/src/store/useAppStore';
import { InterestFocus, RoleFocus } from '@/src/types/story';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { useBriefing } from '@/src/features/briefing/useBriefing';

const roles: RoleFocus[] = ['Product', 'Founder', 'Operator', 'Investor'];
const interests: InterestFocus[] = ['AI', 'Policy', 'Markets', 'Infrastructure', 'Distribution'];
const notificationModes: NotificationMode[] = ['Morning brief', 'Breaking only', 'Muted'];
const readingModes: ReadingMode[] = ['Concise', 'Standard', 'Deep dive'];
const subscriptionTiers: SubscriptionTier[] = ['Free', 'Premium preview'];

function PreferenceRow({
  label,
  body,
  options,
  active,
  onSelect,
}: {
  label: string;
  body: string;
  options: string[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceCopy}>
        <AppText variant="body" style={styles.preferenceTitle}>
          {label}
        </AppText>
        <AppText variant="bodySmall">{body}</AppText>
      </View>
      <View style={styles.wrap}>
        {options.map((option) => (
          <Chip key={option} label={option} active={active === option} onPress={() => onSelect(option)} />
        ))}
      </View>
    </View>
  );
}

export default function ProfileRoute() {
  const roleFocus = useAppStore((state) => state.roleFocus);
  const interestFocus = useAppStore((state) => state.interestFocus);
  const notificationMode = useAppStore((state) => state.notificationMode);
  const readingMode = useAppStore((state) => state.readingMode);
  const subscriptionTier = useAppStore((state) => state.subscriptionTier);
  const accessEmail = useAppStore((state) => state.accessEmail);
  const toggleRole = useAppStore((state) => state.toggleRole);
  const toggleInterest = useAppStore((state) => state.toggleInterest);
  const setNotificationMode = useAppStore((state) => state.setNotificationMode);
  const setReadingMode = useAppStore((state) => state.setReadingMode);
  const setSubscriptionTier = useAppStore((state) => state.setSubscriptionTier);
  const { savedStories, themes, watchlist } = useBriefing();

  const coveredWatchTokens = watchlist.filter((item) => item.count > 0).length;
  const strongestTheme = themes[0];

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="hero">Profile</AppText>
        <AppText variant="body">
          Tune how Second Order ranks stories, how often it nudges you, and how much depth each reading session should feel like.
        </AppText>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <AppText variant="caption">Subscription</AppText>
          <AppText variant="section">{subscriptionTier}</AppText>
          <AppText variant="bodySmall">
            {subscriptionTier === 'Premium preview'
              ? 'Full feed posture, deeper analysis surfaces, and premium briefing framing.'
              : 'Limited access posture aligned with the freemium brief.'}
          </AppText>
        </View>
        <View style={styles.metricCard}>
          <AppText variant="caption">Reading mode</AppText>
          <AppText variant="section">{readingMode}</AppText>
          <AppText variant="bodySmall">Current tone for how dense the product should feel when you scan the briefing.</AppText>
        </View>
      </View>

      <SectionCard eyebrow="Current lens" title={`${roleFocus.join(' + ')} mode`}>
        <AppText variant="bodySmall">
          Biasing the feed toward {interestFocus.join(', ')} with {coveredWatchTokens} watchlist tokens currently mapped to live briefings.
        </AppText>
        {strongestTheme ? (
          <View style={styles.lensNote}>
            <AppText variant="caption" style={styles.lensNoteLabel}>
              Strongest live theme
            </AppText>
            <AppText variant="bodySmall">{strongestTheme.label}</AppText>
          </View>
        ) : null}
      </SectionCard>

      <SectionCard eyebrow="Subscription status" title="Choose the product tier you are simulating">
        <PreferenceRow
          label="Access tier"
          body="Lets the profile reflect the actual free vs premium product model in the brief, instead of pretending settings do not exist yet."
          options={subscriptionTiers}
          active={subscriptionTier}
          onSelect={(value) => setSubscriptionTier(value as SubscriptionTier)}
        />
        <View style={styles.statusCard}>
          <AppText variant="caption">Preview identity</AppText>
          <AppText variant="bodySmall">{accessEmail ?? 'No preview email captured yet'}</AppText>
        </View>
      </SectionCard>

      <SectionCard eyebrow="Notification controls" title="How often should Second Order interrupt you?">
        <PreferenceRow
          label="Delivery mode"
          body="Morning brief fits the core habit. Breaking only is for sharper signal filtering. Muted leaves the app pull-only."
          options={notificationModes}
          active={notificationMode}
          onSelect={(value) => setNotificationMode(value as NotificationMode)}
        />
      </SectionCard>

      <SectionCard eyebrow="Reading preferences" title="How dense should the product feel?">
        <PreferenceRow
          label="Reading depth"
          body="Concise prioritises fast scanning. Standard balances speed and context. Deep dive assumes you want more room for implication analysis."
          options={readingModes}
          active={readingMode}
          onSelect={(value) => setReadingMode(value as ReadingMode)}
        />
        <View style={styles.twoUp}>
          <View style={styles.infoCard}>
            <AppText variant="caption">Saved desk</AppText>
            <AppText variant="section">{savedStories.length}</AppText>
            <AppText variant="bodySmall">Stories currently worth revisiting.</AppText>
          </View>
          <View style={styles.infoCard}>
            <AppText variant="caption">Theme coverage</AppText>
            <AppText variant="section">{themes.length}</AppText>
            <AppText variant="bodySmall">Narratives the current feed can already cluster.</AppText>
          </View>
        </View>
      </SectionCard>

      <SectionCard eyebrow="Role lens" title="Optimise for">
        <View style={styles.wrap}>
          {roles.map((role) => (
            <Chip key={role} label={role} active={roleFocus.includes(role)} onPress={() => toggleRole(role)} />
          ))}
        </View>
      </SectionCard>

      <SectionCard eyebrow="Interest bias" title="Lean into">
        <View style={styles.wrap}>
          {interests.map((interest) => (
            <Chip key={interest} label={interest} active={interestFocus.includes(interest)} onPress={() => toggleInterest(interest)} />
          ))}
        </View>
      </SectionCard>

      <Link href="/settings/methodology" asChild>
        <Pressable style={({ pressed }) => [styles.methodologyLink, pressed && styles.methodologyLinkPressed]}>
          <View style={styles.methodologyCopy}>
            <AppText variant="caption">Trust & methodology</AppText>
            <AppText variant="body">Open the explanation of how reporting, inference, and uncertainty are separated.</AppText>
          </View>
          <AppText variant="bodySmall" style={styles.methodologyLinkText}>
            Open
          </AppText>
        </Pressable>
      </Link>
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
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  preferenceRow: {
    gap: spacing.md,
  },
  preferenceCopy: {
    gap: spacing.xs,
  },
  preferenceTitle: {
    fontWeight: '700',
  },
  lensNote: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  lensNoteLabel: {
    color: colors.textSecondary,
  },
  statusCard: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  twoUp: {
    gap: spacing.md,
  },
  infoCard: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  methodologyLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  methodologyLinkPressed: {
    opacity: 0.84,
  },
  methodologyCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  methodologyLinkText: {
    color: colors.accent,
    fontWeight: '700',
  },
});