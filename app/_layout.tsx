import '../global.css';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui'; // Or similar if needed for root background

export default function Layout() {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </View>
  );
}
