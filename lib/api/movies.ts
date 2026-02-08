import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchFromTMDB } from './client';
import type { Movie, MovieDetails, Credits, Video, PaginatedResponse } from './types';

// Query Keys
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (type: string) => [...movieKeys.lists(), type] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  credits: (id: number) => [...movieKeys.detail(id), 'credits'] as const,
  videos: (id: number) => [...movieKeys.detail(id), 'videos'] as const,
  similar: (id: number) => [...movieKeys.detail(id), 'similar'] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
};

// Hooks
export function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: movieKeys.list('popular'),
    queryFn: ({ pageParam = 1 }) =>
      fetchFromTMDB<PaginatedResponse<Movie>>('/movie/popular', {
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}

export function useNowPlayingMovies() {
  return useInfiniteQuery({
    queryKey: movieKeys.list('now_playing'),
    queryFn: ({ pageParam = 1 }) =>
      fetchFromTMDB<PaginatedResponse<Movie>>('/movie/now_playing', {
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}

export function useTopRatedMovies() {
  return useInfiniteQuery({
    queryKey: movieKeys.list('top_rated'),
    queryFn: ({ pageParam = 1 }) =>
      fetchFromTMDB<PaginatedResponse<Movie>>('/movie/top_rated', {
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}

export function useUpcomingMovies() {
  return useInfiniteQuery({
    queryKey: movieKeys.list('upcoming'),
    queryFn: ({ pageParam = 1 }) =>
      fetchFromTMDB<PaginatedResponse<Movie>>('/movie/upcoming', {
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}

export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return useInfiniteQuery({
    queryKey: movieKeys.list(`trending_${timeWindow}`),
    queryFn: ({ pageParam = 1 }) =>
      fetchFromTMDB<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`, {
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => fetchFromTMDB<MovieDetails>(`/movie/${movieId}`),
    enabled: !!movieId,
  });
}

export function useMovieCredits(movieId: number) {
  return useQuery({
    queryKey: movieKeys.credits(movieId),
    queryFn: () => fetchFromTMDB<Credits>(`/movie/${movieId}/credits`),
    enabled: !!movieId,
  });
}

export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: movieKeys.videos(movieId),
    queryFn: () => fetchFromTMDB<{ id: number; results: Video[] }>(`/movie/${movieId}/videos`),
    enabled: !!movieId,
  });
}

export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: movieKeys.similar(movieId),
    queryFn: () => fetchFromTMDB<PaginatedResponse<Movie>>(`/movie/${movieId}/similar`),
    enabled: !!movieId,
  });
}

export function useSearchMovies(query: string) {
  return useInfiniteQuery({
    queryKey: movieKeys.search(query),
    queryFn: ({ pageParam = 1 }) =>
      fetchFromTMDB<PaginatedResponse<Movie>>('/search/movie', {
        query,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: query.length > 0,
  });
}
