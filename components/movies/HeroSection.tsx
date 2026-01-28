import { getImageUrl, IMAGE_SIZES } from '@/lib/api';
import type { Movie } from '@/lib/api';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Dimensions, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { PlayIcon, InfoIcon } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface HeroSectionProps {
  movie: Movie;
}

export function HeroSection({ movie }: HeroSectionProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const imageUrl = getImageUrl(movie.backdrop_path, IMAGE_SIZES.backdrop.large);

  return (
    <View style={{ height: width * 1.2 + insets.top, position: 'relative' }}>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      )}
      {/* Top gradient for status bar visibility */}
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top + 60,
        }}
      />
      {/* Bottom gradient */}
      <LinearGradient
        colors={['transparent', `${colors.background}CC`, colors.background]}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 24,
          left: 16,
          right: 16,
        }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 8,
          }}
          numberOfLines={2}>
          {movie.title}
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            marginBottom: 12,
          }}
          numberOfLines={2}>
          {movie.overview}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Link href={`/movie/${movie.id}`} asChild>
            <Button style={{ flex: 1, backgroundColor: 'white' }}>
              <PlayIcon size={20} color="black" />
              <Text style={{ color: 'black', fontWeight: '600' }}>Play</Text>
            </Button>
          </Link>
          <Link href={`/movie/${movie.id}`} asChild>
            <Button variant="secondary" style={{ flex: 1, backgroundColor: '#404040' }}>
              <InfoIcon size={20} color="white" />
              <Text style={{ color: 'white' }}>More Info</Text>
            </Button>
          </Link>
        </View>
      </View>
    </View>
  );
}
