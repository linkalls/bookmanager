import { Tabs } from 'expo-router';
import { LogBox, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '../src/context/AppContext';
import { Home, Library, Settings } from 'lucide-react-native';

LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

function TabsLayout() {
  const { theme, t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.cardBorder,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('search'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('myLibrary'),
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="book/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <TabsLayout />
      </AppProvider>
    </SafeAreaProvider>
  );
}
