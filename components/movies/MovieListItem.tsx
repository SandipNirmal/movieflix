import { getImageUrl, IMAGE_SIZES } from '@/lib/api';
import type { Movie } from '@/lib/api';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, View, useColorScheme } from 'react-native';
import { Text } from '@/components/ui/text';
import { Colors, Spacing } from '@/constants/theme';

const dimensions = {
  width: 280,
  height: 64,
};

export function MovieListItem({ movie }: { movie: Movie }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const imageUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.poster.medium);

  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1, // Feedback on press
            paddingHorizontal: Spacing.two,
            paddingVertical: Spacing.one, // Smaller vertical gap between items
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundElement,
            borderRadius: 12, // Smoother corners
            padding: Spacing.one, // Padding inside the card
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}>
          {/* Thumbnail Container */}
          <View
            style={{
              width: 70, // Fixed width for consistency
              height: 100, // Movie posters look better in portrait 3:2 or 4:3
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: colors.backgroundDark, // Fallback color
            }}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.textSecondary, fontSize: 10 }}>No Image</Text>
              </View>
            )}
          </View>

          {/* Text Content */}
          <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 4,
              }}
              numberOfLines={2}>
              {movie.title}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#FFD700', fontSize: 13 }}>★ </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                {movie?.vote_average?.toFixed(1) || 'NA'}
                {movie.release_date ? `  •  ${movie.release_date.split('-')[0]}` : ''}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
