import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useAppStore } from '@/src/store/useAppStore';
import { AppText } from '@/src/components/ui/AppText';
import { colors, radius, spacing } from '@/src/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAppStore((state) => state.hydrate);
  const hydrated = useAppStore((state) => state.hydrated);
  const unlocked = useAppStore((state) => state.unlocked);
  const unlock = useAppStore((state) => state.unlock);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    hydrate().finally(() => SplashScreen.hideAsync());
  }, [hydrate]);

  if (!hydrated) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar style="dark" />
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (!unlocked) {
    return (
      <View style={styles.gateScreen}>
        <StatusBar style="dark" />
        <View style={styles.gateCard}>
          <AppText variant="caption">Private build</AppText>
          <AppText variant="title">Second Order</AppText>
          <AppText variant="body">Enter the preview password to open the current build.</AppText>
          <TextInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (error) setError('');
            }}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={styles.input}
          />
          {error ? <AppText variant="bodySmall">{error}</AppText> : null}
          <Pressable
            onPress={() => {
              const ok = unlock(password);
              if (!ok) setError('Wrong password. Try again.');
            }}
            style={styles.button}>
            <AppText variant="body" style={styles.buttonLabel}>
              Open preview
            </AppText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F3EE' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="story/[storyId]" options={{ headerShown: true, title: 'Story', presentation: 'card' }} />
        <Stack.Screen name="settings/methodology" options={{ headerShown: true, title: 'Methodology' }} />
        <Stack.Screen name="modal/source-sheet" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  gateScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  gateCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  buttonLabel: {
    color: colors.surface,
    fontWeight: '600',
  },
});
