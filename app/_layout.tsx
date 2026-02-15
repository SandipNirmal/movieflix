import '@/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OfflineScreen, { useIsOffline } from './_offline';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      experimental_prefetchInRender: true,
    },
  },
});

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isOffline = useIsOffline();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          {isOffline ? (
            <OfflineScreen />
          ) : (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="movie/[id]" options={{ presentation: 'card' }} />
            </Stack>
          )}
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
