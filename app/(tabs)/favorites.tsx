import { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { HeartIcon } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { FlashList as FlatList } from '@shopify/flash-list';
import { useIsFocused } from '@react-navigation/native';

import { useFavouriteMovies } from '../../hooks/index';
import { MovieListItem } from '@/components/movies';
import { Button } from '@/components/ui/button';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const isFocused = useIsFocused();
  const { getFavouriteMovies, loadFavourites } = useFavouriteMovies();
  const favouriteMovies = getFavouriteMovies();

  useEffect(() => {
    if (isFocused) {
      loadFavourites();
    }
  }, [isFocused, loadFavourites]);

  if (favouriteMovies.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingHorizontal: insets.left,
          gap: Spacing.three,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top + Spacing.three,
        paddingHorizontal: insets.left,
        gap: Spacing.three,
      }}>
      {/*<View
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
        <Button>Delete All</Button>
      </View>*/}
      <View style={{ flex: 1, paddingHorizontal: Spacing.two }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Favourites</Text>
        <FlatList
          data={favouriteMovies}
          renderItem={({ item }) => <MovieListItem movie={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ flexGrow: 1, marginVertical: Spacing.three }}
        />
      </View>
    </View>
  );
}
