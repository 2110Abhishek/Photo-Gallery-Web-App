import { useState, useEffect } from 'react';

const API_URL = 'https://picsum.photos/v2/list?limit=30';

/**
 * Custom hook to fetch photo collection from the Picsum Photos API.
 *
 * Responsibilities:
 * - Fetches 30 photos on initial mount
 * - Tracks loading state (spinner during fetch, hidden after completion)
 * - Tracks readable error message upon HTTP or network failure
 * - Prevents state updates on unmounted components via AbortController
 *
 * Usage:
 *   const { photos, loading, error } = useFetchPhotos();
 *
 * @returns {{ photos: Array, loading: boolean, error: string|null }}
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchPhotos() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL, { signal });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} (${response.statusText || 'Failed to fetch photos'})`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: Expected an array of photos.');
        }

        setPhotos(data);
        setError(null);
      } catch (err) {
        // If request was aborted, ignore error to prevent updating unmounted component
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Error fetching photos:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load photos. Please check your internet connection.'
        );
      } finally {
        // Only update loading state if the request was not aborted
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    // Cleanup: cancel in-flight request when component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  return { photos, loading, error };
}

export default useFetchPhotos;