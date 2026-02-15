import { useState, useCallback } from 'react';
import { View, FlatList, useColorScheme, ActivityIndicator, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useSearchMovies } from '@/lib/api';
import { MovieCard } from '@/components/movies';
import { Text } from '@/components/ui/text';
import { Colors, BottomTabInset, Spacing } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks';

export default function SearchScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 500);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMovies(debouncedQuery);

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ padding: Spacing.three, alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }, [isFetchingNextPage, colors.primary]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Search',
          headerSearchBarOptions: {
            placeholder: 'Search movies...',
            onChangeText: (e) => setQuery(e.nativeEvent.text),
            hideWhenScrolling: false,
            autoCapitalize: 'none',
          },
        }}
      />

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {isLoading && debouncedQuery.length > 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : movies.length === 0 && debouncedQuery.length > 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>No movies found</Text>
          </View>
        ) : movies.length === 0 ? (
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>Search for your favorite movies</Text>
          </ScrollView>
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              paddingHorizontal: Spacing.two,
              paddingBottom: BottomTabInset + Spacing.six,
            }}
            columnWrapperStyle={{
              gap: Spacing.two,
              marginBottom: Spacing.three,
              justifyContent: 'space-between',
            }}
            renderItem={({ item }) => <MovieCard movie={item} size="small" />}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </>
  );
}
