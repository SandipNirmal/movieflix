import { TMDB_CONFIG } from './config';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchFromTMDB<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const url = new URL(`${TMDB_CONFIG.BASE_URL}${endpoint}`);

  url.searchParams.set('api_key', TMDB_CONFIG.API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`);
  }

  return response.json();
}
