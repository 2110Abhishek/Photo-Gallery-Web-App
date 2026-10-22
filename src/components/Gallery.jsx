import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos';
import {
  favouritesReducer,
  initFavourites,
  FAVOURITES_ACTIONS,
  STORAGE_KEY,
} from '../reducers/favouritesReducer';
import PhotoCard from './PhotoCard';
import LoadingSpinner from './LoadingSpinner';

/**
 * Gallery.jsx
 * Connects photo fetching, search filtering, reducer-based favourites state, and responsive UI.
 *
 * Requirements Met:
 * - FR-02: Consumes custom hook `useFetchPhotos` (no duplicate fetch logic)
 * - FR-03: Responsive 4-col (desktop) / 2-col (tablet) / 1-col (mobile) grid
 * - FR-04: Real-time author search with case-insensitive matching
 * - FR-05: Favourites managed via `useReducer` with TOGGLE_FAVOURITE
 * - FR-06: localStorage synchronization via `useEffect` with safe fallback
 * - FR-08: Explicit usage of `useCallback` for search and `useMemo` for filtering
 */
export default function Gallery() {
  // FR-02 & FR-07: Custom Hook returning { photos, loading, error }
  const { photos, loading, error } = useFetchPhotos();

  // FR-04: Search query managed with useState (permitted for search field)
  const [searchQuery, setSearchQuery] = useState('');

  // FR-05 & FR-06: Favourites state managed strictly via useReducer with safe localStorage initialization
  const [favourites, dispatch] = useReducer(favouritesReducer, [], initFavourites);

  // FR-06: Synchronize favourites to localStorage whenever reducer state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch (err) {
      console.error('Failed to persist favourites to localStorage:', err);
    }
  }, [favourites]);

  // FR-08: Mandatory useCallback for search input handler
  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  // Callback to toggle favourite via useReducer dispatch
  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({
      type: FAVOURITES_ACTIONS.TOGGLE_FAVOURITE,
      id: photoId,
    });
  }, []);

  // Clear search input helper
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // FR-08: Mandatory useMemo for computing the filtered photo collection
  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return photos;
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    );
  }, [photos, searchQuery]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="Photo Gallery Section">
      {/* Search Bar & Stats Header */}
      <div className="mb-10 max-w-2xl mx-auto">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute left-4 pointer-events-none text-slate-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            id="author-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by author..."
            aria-label="Search photos by author name"
            className="w-full pl-12 pr-12 py-3.5 bg-slate-900/90 text-slate-100 placeholder-slate-400 text-sm md:text-base rounded-2xl border border-slate-700/80 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/20 shadow-xl backdrop-blur-sm transition-all duration-200"
          />

          {/* Clear Search Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search query"
              className="absolute right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Gallery Status Counters */}
        {!loading && !error && (
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 mt-3 px-2">
            <span>
              {searchQuery.trim() ? (
                <>
                  Showing <strong className="text-rose-400">{filteredPhotos.length}</strong> of{' '}
                  <strong className="text-slate-200">{photos.length}</strong> photos
                </>
              ) : (
                <>
                  Total Photos: <strong className="text-slate-200">{photos.length}</strong>
                </>
              )}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <svg
                className="w-4 h-4 text-rose-500 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>
                Favourites: <strong className="text-rose-400 font-semibold">{favourites.length}</strong>
              </span>
            </span>
          </div>
        )}
      </div>

      {/* State 1: Loading State */}
      {loading && <LoadingSpinner message="Fetching 30 curated photos from Picsum..." />}

      {/* State 2: Error State */}
      {!loading && error && (
        <div
          role="alert"
          className="max-w-xl mx-auto my-12 p-6 rounded-2xl bg-rose-950/30 border border-rose-800/60 text-center shadow-2xl backdrop-blur-sm"
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-rose-200 mb-2">Failed to Load Gallery</h2>
          <p className="text-sm text-rose-300/90 mb-5 leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-colors shadow-lg shadow-rose-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            Reload Page
          </button>
        </div>
      )}

      {/* State 3: Empty Search Results */}
      {!loading && !error && filteredPhotos.length === 0 && (
        <div className="max-w-md mx-auto my-16 p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-200 mb-1">No photos found</h2>
          <p className="text-sm text-slate-400 mb-6">
            No authors match &ldquo;
            <span className="text-rose-400 font-medium">{searchQuery}</span>
            &rdquo;. Try searching with a different name or clearing your search.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* State 4: Responsive Photo Grid (Desktop 4 cols, Tablet 2 cols, Mobile 1 col) */}
      {!loading && !error && filteredPhotos.length > 0 && (
        <div
          id="photo-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavourite={favourites.includes(String(photo.id))}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </section>
  );
}
