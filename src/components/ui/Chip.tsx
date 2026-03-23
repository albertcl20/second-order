import { Pressable, StyleSheet } from 'react-native';
import { AppText } from '@/src/components/ui/AppText';
import { colors, radius, spacing } from '@/src/theme/tokens';

export function Chip({ label, active = false, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.base, active && styles.active]}>
      <AppText variant="caption" style={[styles.label, active && styles.activeLabel]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  active: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  label: {
    color: colors.textSecondary,
    textTransform: 'none',
    letterSpacing: 0,
  },
  activeLabel: {
    color: colors.surface,
  },
});
