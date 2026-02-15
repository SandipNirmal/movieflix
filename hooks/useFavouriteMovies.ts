import { useState, useEffect, useCallback } from 'react';

import {
  addMovieToFavourite as addMovie,
  removeMovieFromFavourite as removeMovie,
  getFavouriteMovies as getMovies,
} from '../lib/storage';

export const useFavouriteMovies = () => {
  const [favourites, setFavourites] = useState<Record<string, any>>({});

  const loadFavourites = useCallback(async () => {
    const movies = await getMovies();
    setFavourites(movies);
  }, []);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

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

  return {
    addMovieToFavourite,
    removeMovieFromFavourite,
    getFavouriteMovies,
  };
};
