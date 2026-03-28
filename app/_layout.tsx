import { Redirect, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useAppStore } from '@/src/store/useAppStore';
import { AppText } from '@/src/components/ui/AppText';
import { colors, radius, spacing } from '@/src/theme/tokens';
import { hiddenSigninSlug, previewEnabled } from '@/src/lib/runtime-config';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAppStore((state) => state.hydrate);
  const hydrated = useAppStore((state) => state.hydrated);
  const unlocked = useAppStore((state) => state.unlocked);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const unlock = useAppStore((state) => state.unlock);
  const segments = useSegments();
  const isMarketingRoute = segments[0] === undefined;
  const isOnboardingRoute = segments[0] === 'onboarding';
  const isHiddenSigninRoute = segments[0] === hiddenSigninSlug;

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

  if (!isMarketingRoute && !isHiddenSigninRoute && !unlocked) {
    return (
      <View style={styles.gateScreen}>
        <StatusBar style="dark" />
        <View style={styles.gateCard}>
          <AppText variant="caption">Private build</AppText>
          <AppText variant="title">Second Order</AppText>
          <AppText variant="body">
            This public build only exposes the marketing site. Product routes stay hidden until preview access is enabled at build time.
          </AppText>
          <AppText variant="bodySmall">
            This replaces the old client-side password gate, which was only cosmetic and could leak via the bundled app.
          </AppText>
          {previewEnabled ? (
            <Pressable
              onPress={() => {
                unlock();
              }}
              style={styles.button}>
              <AppText variant="body" style={styles.buttonLabel}>
                Open preview
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }

  if (!isMarketingRoute && unlocked && !onboardingCompleted && !isOnboardingRoute) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name={hiddenSigninSlug} options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen
          name="story/[storyId]"
          options={{
            headerShown: true,
            title: 'Story',
            presentation: 'card',
          }}
        />
        <Stack.Screen name="settings/methodology" options={{ headerShown: true, title: 'Methodology' }} />
        <Stack.Screen
          name="modal/source-sheet"
          options={{
            headerShown: true,
            title: 'Sources',
            presentation: 'modal',
          }}
        />
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
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
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
