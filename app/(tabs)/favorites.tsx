import { View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { HeartIcon } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';

import { useFavouriteMovies } from '../../hooks/index';
import { MovieCard } from '@/components/movies';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { getFavouriteMovies } = useFavouriteMovies();

  const favouriteMovies = Object.values(getFavouriteMovies());

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.three,
      }}>
      {favouriteMovies.length === 0 ? (
        <>
          <HeartIcon size={64} color={colors.textSecondary} />
          <Text style={{ color: colors.textSecondary, fontSize: 18 }}>No favorites yet</Text>
          <Text
            style={{
              color: colors.textSecondary,
              textAlign: 'center',
              paddingHorizontal: Spacing.five,
            }}>
            Tap the heart icon on any movie to add it to your favorites
          </Text>
        </>
      ) : (
        <View>
          {favouriteMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </View>
      )}
    </View>
  );
}
