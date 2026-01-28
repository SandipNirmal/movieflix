import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useMovieDetails, useMovieCredits, useSimilarMovies, getImageUrl, IMAGE_SIZES } from '@/lib/api';
import { MovieCard } from '@/components/movies';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  View,
  Dimensions,
  useColorScheme,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeftIcon, PlayIcon, HeartIcon, StarIcon, ClockIcon } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = parseInt(id, 10);
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { data: movie, isLoading } = useMovieDetails(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { data: similar } = useSimilarMovies(movieId);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.text }}>Movie not found</Text>
      </View>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, IMAGE_SIZES.backdrop.large);
  const posterUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.poster.large);
  const director = credits?.crew.find((c) => c.job === 'Director');
  const cast = credits?.cast.slice(0, 10) ?? [];
  const similarMovies = similar?.results.slice(0, 10) ?? [];

  const formatRuntime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Backdrop */}
        <View style={{ height: width * 0.8, position: 'relative' }}>
          {backdropUrl && (
            <Image
              source={{ uri: backdropUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          )}
          <LinearGradient
            colors={['transparent', colors.background]}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' }}
          />

          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={{
              position: 'absolute',
              top: insets.top + Spacing.two,
              left: Spacing.three,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 20,
              padding: Spacing.two,
            }}
          >
            <ArrowLeftIcon size={24} color="white" />
          </Pressable>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: Spacing.three, marginTop: -Spacing.six }}>
          <View style={{ flexDirection: 'row', gap: Spacing.three }}>
            {/* Poster */}
            <View style={{ width: 120, height: 180, borderRadius: Spacing.two, overflow: 'hidden' }}>
              {posterUrl && (
                <Image
                  source={{ uri: posterUrl }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              )}
            </View>

            {/* Info */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold' }} numberOfLines={2}>
                {movie.title}
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.one }}>
                {movie.release_date && (
                  <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                    {new Date(movie.release_date).getFullYear()}
                  </Text>
                )}
                {movie.runtime > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <ClockIcon size={14} color={colors.textSecondary} />
                    <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                      {formatRuntime(movie.runtime)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.one }}>
                <StarIcon size={16} color="#FFD700" />
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                  {movie.vote_average.toFixed(1)}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  ({movie.vote_count.toLocaleString()} votes)
                </Text>
              </View>
            </View>
          </View>

          {/* Genres */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.three }}>
            {movie.genres.map((genre) => (
              <View
                key={genre.id}
                style={{
                  backgroundColor: colors.backgroundElement,
                  paddingHorizontal: Spacing.two + Spacing.one,
                  paddingVertical: Spacing.one,
                  borderRadius: Spacing.two,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 12 }}>{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three }}>
            <Button style={{ flex: 1, backgroundColor: colors.primary }}>
              <PlayIcon size={20} color="white" />
              <Text style={{ color: 'white', fontWeight: '600' }}>Play</Text>
            </Button>
            <Button variant="outline" style={{ backgroundColor: colors.backgroundElement }}>
              <HeartIcon size={20} color={colors.text} />
            </Button>
          </View>

          {/* Overview */}
          {movie.overview && (
            <View style={{ marginTop: Spacing.four }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: Spacing.two }}>
                Overview
              </Text>
              <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>{movie.overview}</Text>
            </View>
          )}

          {/* Director */}
          {director && (
            <View style={{ marginTop: Spacing.three }}>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                Director: <Text style={{ color: colors.text }}>{director.name}</Text>
              </Text>
            </View>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <View style={{ marginTop: Spacing.four }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: Spacing.two }}>
                Cast
              </Text>
              <FlatList
                data={cast}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={{ marginRight: Spacing.three, alignItems: 'center', width: 80 }}>
                    <View
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        overflow: 'hidden',
                        backgroundColor: colors.backgroundElement,
                      }}
                    >
                      {item.profile_path ? (
                        <Image
                          source={{ uri: getImageUrl(item.profile_path, IMAGE_SIZES.profile.medium)! }}
                          style={{ width: '100%', height: '100%' }}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: colors.textSecondary }}>?</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: colors.text, fontSize: 12, marginTop: 4, textAlign: 'center' }} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 10, textAlign: 'center' }} numberOfLines={1}>
                      {item.character}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <View style={{ marginTop: Spacing.four, marginBottom: Spacing.six }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: Spacing.two }}>
                Similar Movies
              </Text>
              <FlatList
                data={similarMovies}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <MovieCard movie={item} size="small" />}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
