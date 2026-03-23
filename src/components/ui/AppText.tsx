import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { colors, typography } from '@/src/theme/tokens';

export function AppText({ children, variant = 'body', style }: PropsWithChildren<{ variant?: 'hero' | 'title' | 'section' | 'body' | 'bodySmall' | 'caption'; style?: StyleProp<TextStyle>; }>) {
  return <Text style={[styles.base, styles[variant], style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
  hero: {
    fontSize: typography.hero,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  title: {
    fontSize: typography.title,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  section: {
    fontSize: typography.section,
    lineHeight: 26,
    fontWeight: '700',
  },
  body: {
    fontSize: typography.body,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: typography.bodySmall,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  caption: {
    fontSize: typography.caption,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
