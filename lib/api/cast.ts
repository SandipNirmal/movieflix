import { useQuery } from '@tanstack/react-query';
import { fetchFromTMDB } from './client';
import type { PersonDetail, PersonCredits } from './types';

export const castKeys = {
  all: ['cast'] as const,
  detail: (id: number) => [...castKeys.all, 'detail', id] as const,
  credits: (id: number) => [...castKeys.all, 'credits', id] as const,
};

export function useCastDetail(personId: number) {
  return useQuery({
    queryKey: castKeys.detail(personId),
    queryFn: () => fetchFromTMDB<PersonDetail>(`/person/${personId}`),
    enabled: !!personId,
  });
}

export function useCastMovieCredits(personId: number) {
  return useQuery({
    queryKey: castKeys.credits(personId),
    queryFn: () => fetchFromTMDB<PersonCredits>(`/person/${personId}/movie_credits`),
    enabled: !!personId,
  });
}
