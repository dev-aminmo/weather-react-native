// app/_layout.tsx
import { Stack } from 'expo-router';
import { WeatherProvider } from './context/WeatherContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WeatherProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#f8fafc' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="results" />
        </Stack>
      </WeatherProvider>
    </SafeAreaProvider>
  );
}