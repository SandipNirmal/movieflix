import type { Movie } from '@/lib/api';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { FlashList as FlatList } from '@shopify/flash-list';
import { Text } from '@/components/ui/text';
import { MovieCard } from './MovieCard';
import { Colors, Spacing } from '@/constants/theme';

interface MovieListProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  onEndReached?: () => void;
  hasNextPage?: boolean;
}

export function MovieList({ title, movies, isLoading, onEndReached, hasNextPage }: MovieListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={{ marginBottom: Spacing.four }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: Spacing.two,
          paddingHorizontal: Spacing.three,
        }}>
        {title}
      </Text>
      <View style={{ height: 240 }}>
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard movie={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.three }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasNextPage ? (
              <View style={{ width: 80, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            isLoading ? (
              <View
                style={{
                  height: 210,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
}
