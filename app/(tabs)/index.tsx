import {
  useTrendingMovies,
  usePopularMovies,
  useNowPlayingMovies,
  useTopRatedMovies,
} from '@/lib/api';
import { MovieList, HeroSection } from '@/components/movies';
import { ScrollView, View, RefreshControl, useColorScheme, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Uniwind, useUniwind } from 'uniwind';
import { SunIcon, MoonIcon } from 'lucide-react-native';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const colors = Colors[theme === 'dark' ? 'dark' : 'light'];
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const toggleTheme = () => {
    Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const trending = useTrendingMovies('week');
  const popular = usePopularMovies();
  const nowPlaying = useNowPlayingMovies();
  const topRated = useTopRatedMovies();

  const trendingMovies = trending.data?.pages.flatMap((page) => page.results) ?? [];
  const popularMovies = popular.data?.pages.flatMap((page) => page.results) ?? [];
  const nowPlayingMovies = nowPlaying.data?.pages.flatMap((page) => page.results) ?? [];
  const topRatedMovies = topRated.data?.pages.flatMap((page) => page.results) ?? [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['movies'] });
    setRefreshing(false);
  }, [queryClient]);

  const heroMovie = trendingMovies[0];
  const isLoading = trending.isLoading;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Theme Toggle Button */}
      <Pressable
        onPress={toggleTheme}
        style={{
          position: 'absolute',
          top: insets.top + Spacing.two,
          right: Spacing.three,
          zIndex: 100,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 20,
          padding: Spacing.two,
        }}>
        {theme === 'dark' ? (
          <SunIcon size={22} color="white" />
        ) : (
          <MoonIcon size={22} color="white" />
        )}
      </Pressable>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.six }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }>
        {heroMovie ? (
          <HeroSection movie={heroMovie} />
        ) : (
          <View style={{ height: insets.top + 200, backgroundColor: colors.background }} />
        )}

      <View style={{ marginTop: Spacing.three }}>
        <MovieList
          title="Trending This Week"
          movies={trendingMovies.slice(1)}
          isLoading={trending.isLoading}
          onEndReached={() => trending.fetchNextPage()}
          hasNextPage={trending.hasNextPage}
        />

        <MovieList
          title="Now Playing"
          movies={nowPlayingMovies}
          isLoading={nowPlaying.isLoading}
          onEndReached={() => nowPlaying.fetchNextPage()}
          hasNextPage={nowPlaying.hasNextPage}
        />

        <MovieList
          title="Popular"
          movies={popularMovies}
          isLoading={popular.isLoading}
          onEndReached={() => popular.fetchNextPage()}
          hasNextPage={popular.hasNextPage}
        />

        <MovieList
          title="Top Rated"
          movies={topRatedMovies}
          isLoading={topRated.isLoading}
          onEndReached={() => topRated.fetchNextPage()}
          hasNextPage={topRated.hasNextPage}
        />
      </View>
      </ScrollView>
    </View>
  );
}
