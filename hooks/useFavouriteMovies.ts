import { useState, useCallback } from 'react';

import {
  addMovieToFavourite as addMovie,
  removeMovieFromFavourite as removeMovie,
  getFavouriteMovies as getMovies,
} from '../lib/storage';

export const useFavouriteMovies = () => {
  const [favourites, setFavourites] = useState<any[]>([]);

  const loadFavourites = useCallback(async () => {
    const movies = await getMovies();
    setFavourites(Object.values(movies));
  }, []);

  const addMovieToFavourite = async (movieId: number, movie: any) => {
    await addMovie(movieId, movie);
    await loadFavourites();
  };

  const removeMovieFromFavourite = async (movieId: number) => {
    await removeMovie(movieId);
    await loadFavourites();
  };

  const getFavouriteMovies = () => {
    return favourites;
  };

  const isFavouriteMovie = async (movieId: number): Promise<boolean> => {
    const movies = await getMovies();
    return !!movies[movieId];
  };

  return {
    addMovieToFavourite,
    removeMovieFromFavourite,
    getFavouriteMovies,
    loadFavourites,
    isFavouriteMovie,
  };
};
