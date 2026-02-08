import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useCastDetail, useCastMovieCredits, getImageUrl, IMAGE_SIZES } from '@/lib/api';
import { Text } from '@/components/ui/text';
import { Image } from 'expo-image';
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
import { ArrowLeftIcon, StarIcon, CakeIcon, MapPinIcon } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function CastDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = parseInt(id, 10);
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [showFullBio, setShowFullBio] = useState(false);

  const { data: person, isLoading } = useCastDetail(personId);
  const { data: credits } = useCastMovieCredits(personId);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!person) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ color: colors.text }}>Person not found</Text>
      </View>
    );
  }

  const profileUrl = getImageUrl(person.profile_path, IMAGE_SIZES.profile.large);
  const knownFor =
    credits?.cast
      .filter((c) => c.poster_path)
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 10) ?? [];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const age = person.birthday
    ? Math.floor(
        (Date.now() - new Date(person.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header with back button */}
        <View style={{ paddingTop: insets.top + Spacing.two, paddingHorizontal: Spacing.three }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: colors.backgroundElement,
              borderRadius: 20,
              padding: Spacing.two,
              alignSelf: 'flex-start',
            }}>
            <ArrowLeftIcon size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Profile section */}
        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: Spacing.three,
            marginTop: Spacing.three,
          }}>
          <View
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              overflow: 'hidden',
              backgroundColor: colors.backgroundElement,
            }}>
            {profileUrl ? (
              <Image
                source={{ uri: profileUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.textSecondary, fontSize: 40 }}>?</Text>
              </View>
            )}
          </View>

          <Text
            style={{
              color: colors.text,
              fontSize: 24,
              fontWeight: 'bold',
              marginTop: Spacing.three,
              textAlign: 'center',
            }}>
            {person.name}
          </Text>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginTop: Spacing.one,
            }}>
            {person.known_for_department}
          </Text>
        </View>

        {/* Info row */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: Spacing.four,
            marginTop: Spacing.three,
            paddingHorizontal: Spacing.three,
          }}>
          {person.birthday && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.one }}>
              <CakeIcon size={14} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                {formatDate(person.birthday)}
                {age !== null && !person.deathday ? ` (${age})` : ''}
              </Text>
            </View>
          )}
          {person.place_of_birth && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.one,
                flexShrink: 1,
              }}>
              <MapPinIcon size={14} color={colors.textSecondary} />
              <Text
                style={{ color: colors.textSecondary, fontSize: 13, flexShrink: 1 }}
                numberOfLines={1}>
                {person.place_of_birth}
              </Text>
            </View>
          )}
        </View>

        {person.deathday && (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: 'center',
              marginTop: Spacing.one,
            }}>
            Died: {formatDate(person.deathday)}
          </Text>
        )}

        {/* Biography */}
        {person.biography ? (
          <View style={{ paddingHorizontal: Spacing.three, marginTop: Spacing.four }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '600',
                marginBottom: Spacing.two,
              }}>
              Biography
            </Text>
            <Text
              style={{ color: colors.textSecondary, lineHeight: 22 }}
              numberOfLines={showFullBio ? undefined : 6}>
              {person.biography}
            </Text>
            {person.biography.length > 300 && (
              <Pressable onPress={() => setShowFullBio(!showFullBio)}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    marginTop: Spacing.one,
                  }}>
                  {showFullBio ? 'Show Less' : 'Read More'}
                </Text>
              </Pressable>
            )}
          </View>
        ) : null}

        {/* Known For */}
        {knownFor.length > 0 && (
          <View style={{ marginTop: Spacing.four, marginBottom: Spacing.six }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '600',
                marginBottom: Spacing.two,
                paddingHorizontal: Spacing.three,
              }}>
              Known For
            </Text>
            <FlatList
              data={knownFor}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing.three }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => router.push(`/movie/${item.id}`)}
                  style={{ marginRight: Spacing.two, width: 100 }}>
                  <View
                    style={{
                      width: 100,
                      height: 150,
                      borderRadius: Spacing.two,
                      overflow: 'hidden',
                      backgroundColor: colors.backgroundElement,
                    }}>
                    {item.poster_path ? (
                      <Image
                        source={{
                          uri: getImageUrl(item.poster_path, IMAGE_SIZES.poster.small)!,
                        }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.textSecondary }}>No Image</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{ color: colors.text, fontSize: 12, marginTop: 4 }}
                    numberOfLines={1}>
                    {item.title}
                  </Text>
                  {item.character ? (
                    <Text
                      style={{ color: colors.textSecondary, fontSize: 10 }}
                      numberOfLines={1}>
                      {item.character}
                    </Text>
                  ) : null}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <StarIcon size={10} color="#FFD700" />
                    <Text style={{ color: colors.textSecondary, fontSize: 10 }}>
                      {item.vote_average.toFixed(1)}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}
      </ScrollView>
    </>
  );
}
