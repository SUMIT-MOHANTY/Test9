import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchData } from '../services/api';

// Rate limiting parameters
const RATE_LIMIT_INTERVAL = 1000; // 1 second minimum between requests
const DEBOUNCE_DELAY = 300; // 300ms debounce for rapid fire requests

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseFetchOptions {
  initialFetch?: boolean;
  dependencies?: any[];
  debounce?: number;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = { initialFetch: true, dependencies: [], debounce: DEBOUNCE_DELAY }
): [FetchState<T>, () => Promise<void>] {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: options.initialFetch,
    error: null,
  });

  const lastFetchTimeRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use a ref to keep track of the current URL to prevent stale closures
  const urlRef = useRef(url);
  useEffect(() => {
    urlRef.current = url;
  }, [url]);

  // Create a memoized fetchData function
  const fetchDataFromApi = useCallback(async (skipRateLimit = false): Promise<void> => {
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Apply debounce
    return new Promise<void>((resolve) => {
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const now = Date.now();
          const timeSinceLastFetch = now - lastFetchTimeRef.current;

          // Rate limiting check - unless explicitly skipped
          if (!skipRateLimit && timeSinceLastFetch < RATE_LIMIT_INTERVAL && lastFetchTimeRef.current !== 0) {
            const delayNeeded = RATE_LIMIT_INTERVAL - timeSinceLastFetch;
            await new Promise(r => setTimeout(r, delayNeeded));
          }

          setState(prev => ({ ...prev, loading: true, error: null }));

          const data = await fetchData<T>(urlRef.current);
          lastFetchTimeRef.current = Date.now();

          setState({ data, loading: false, error: null });
          resolve();
        } catch (error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error : new Error('An unknown error occurred')
          }));
          resolve();
        }
      }, options.debounce || DEBOUNCE_DELAY);
    });
  }, [options.debounce]);

  // Fetch on mount or when dependencies change
  useEffect(() => {
    if (options.initialFetch) {
      fetchDataFromApi(true); // Skip rate limiting on initial fetch
    }

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchDataFromApi, options.initialFetch, ...(options.dependencies || [])]);

  return [state, fetchDataFromApi];
}
