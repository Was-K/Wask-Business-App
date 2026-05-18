import { useCallback, useEffect, useState } from 'react';

export interface ApiResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic API resource loader: handles loading, error and refetch.
 * Pass a stable `fetcher` (memoize with useCallback if it depends on props).
 */
export function useApiResource<T>(
  fetcher: () => Promise<T>,
): ApiResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
