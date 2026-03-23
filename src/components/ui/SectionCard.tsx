import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/src/components/ui/AppText';
import { colors, radius, spacing } from '@/src/theme/tokens';

export function SectionCard({ title, eyebrow, children }: PropsWithChildren<{ title?: string; eyebrow?: string }>) {
  return (
    <View style={styles.card}>
      {eyebrow ? <AppText variant="caption">{eyebrow}</AppText> : null}
      {title ? <AppText variant="section">{title}</AppText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
});
