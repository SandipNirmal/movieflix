import { getImageUrl, IMAGE_SIZES } from '@/lib/api';
import type { Movie } from '@/lib/api';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, View, useColorScheme } from 'react-native';
import { Text } from '@/components/ui/text';
import { Colors, Spacing } from '@/constants/theme';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

const sizeStyles = {
  small: { width: 100, height: 150 },
  medium: { width: 140, height: 210 },
  large: { width: 180, height: 270 },
};

export function MovieCard({ movie, size = 'medium' }: MovieCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const imageUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.poster.medium);
  const dimensions = sizeStyles[size];

  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <Pressable style={{ marginRight: Spacing.two }}>
        <View
          style={{
            ...dimensions,
            borderRadius: Spacing.two,
            overflow: 'hidden',
            backgroundColor: colors.backgroundElement,
          }}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.textSecondary }}>No Image</Text>
            </View>
          )}
        </View>
        <View style={{ marginTop: 4, width: dimensions.width }}>
          <Text style={{ color: colors.text, fontSize: 13 }} numberOfLines={1}>
            {movie.title}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
            {movie.vote_average.toFixed(1)} ★
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
