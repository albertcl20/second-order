import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { useAppStore } from '@/src/store/useAppStore';
import { InterestFocus, RoleFocus } from '@/src/types/story';
import { spacing } from '@/src/theme/tokens';

const roles: RoleFocus[] = ['Product', 'Founder', 'Operator', 'Investor'];
const interests: InterestFocus[] = ['AI', 'Policy', 'Markets', 'Infrastructure', 'Distribution'];

export default function ProfileRoute() {
  const roleFocus = useAppStore((state) => state.roleFocus);
  const interestFocus = useAppStore((state) => state.interestFocus);
  const toggleRole = useAppStore((state) => state.toggleRole);
  const toggleInterest = useAppStore((state) => state.toggleInterest);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="hero">Profile</AppText>
        <AppText variant="body">Tune the feed so relevance feels opinionated instead of generic.</AppText>
      </View>

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

      <Link href="/settings/methodology">
        <AppText variant="bodySmall">Open methodology</AppText>
      </Link>
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
