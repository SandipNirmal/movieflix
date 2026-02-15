import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = 'favouriteMovies';

type Movie = {
  id: string;
  title: string;
  poster: string;
  releaseDate: string;
};

export async function getFavouriteMovies(): Promise<Record<string, Movie>> {
  const raw = await AsyncStorage.getItem(FAVOURITES_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function addMovieToFavourite(movieId: number, movie: Movie) {
  const movies = await getFavouriteMovies();
  movies[movieId] = movie;
  await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(movies));
}

export async function removeMovieFromFavourite(movieId: number) {
  const movies = await getFavouriteMovies();
  delete movies[movieId];
  await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(movies));
}
