import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/src/components/ui/AppText';
import { colors, spacing } from '@/src/theme/tokens';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <AppText variant="title">This page wandered off.</AppText>
        <Link href="/" style={styles.link}>
          <AppText variant="body">Go back to the feed</AppText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  link: {
    paddingVertical: spacing.md,
  },
});
