import { useTrendingMovies, usePopularMovies, useNowPlayingMovies, useTopRatedMovies } from '@/lib/api';
import { MovieList, HeroSection } from '@/components/movies';
import { ScrollView, View, RefreshControl, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, BottomTabInset, Spacing } from '@/constants/theme';
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.six }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {heroMovie && <HeroSection movie={heroMovie} />}

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
  );
}
