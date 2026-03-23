import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#161412',
        tabBarInactiveTintColor: '#7A746C',
        tabBarStyle: {
          backgroundColor: '#FFFCF7',
          borderTopColor: '#D9D1C5',
          height: 88,
          paddingTop: 8,
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="today/index" options={{ title: 'Today' }} />
      <Tabs.Screen name="themes/index" options={{ title: 'Themes' }} />
      <Tabs.Screen name="saved/index" options={{ title: 'Saved' }} />
      <Tabs.Screen name="watchlist/index" options={{ title: 'Watchlist' }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
