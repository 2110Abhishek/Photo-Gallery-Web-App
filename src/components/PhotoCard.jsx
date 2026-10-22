import { useState } from 'react';

/**
 * PhotoCard.jsx
 * Displays an individual photo card with author attribution and favourite toggle button.
 *
 * Requirements:
 * - Photo with consistent aspect ratio and object-cover
 * - Clear author's name
 * - Heart-shaped favourite button with active/inactive states
 * - Accessible labels indicating current action
 * - Resilient to individual image loading errors
 */
export default function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use Picsum's optimized dimensions (600x450, 4:3) for fast loading, fallback to download_url
  const displayUrl = `https://picsum.photos/id/${photo.id}/600/450`;

  const handleToggle = () => {
    onToggleFavourite(photo.id);
  };

  return (
    <article
      className="group relative flex flex-col bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-rose-950/20 transition-all duration-300 transform hover:-translate-y-1"
      aria-label={`Photo by ${photo.author}`}
    >
      {/* Image Container with 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        {/* Shimmer Placeholder while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse" />
        )}

        {/* Fallback state if image fails */}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900 text-slate-400 text-center">
            <svg
              className="w-10 h-10 mb-2 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-medium">Image unavailable</span>
          </div>
        ) : (
          <img
            src={displayUrl}
            alt={`Captured by ${photo.author}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Gradient Overlay for visual polish */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

        {/* Heart-shaped Favourite Button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={
            isFavourite
              ? `Remove photo by ${photo.author} from favourites`
              : `Add photo by ${photo.author} to favourites`
          }
          aria-pressed={isFavourite}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 active:scale-90 ${
            isFavourite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-1 ring-rose-400'
              : 'bg-slate-900/60 text-slate-200 hover:text-white hover:bg-slate-900/90 border border-white/10'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 transition-transform duration-200"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? '0' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Card Content Footer */}
      <div className="p-4 flex items-center justify-between gap-3 bg-slate-900/90">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
            Photographer
          </p>
          <h2
            title={photo.author}
            className="text-sm font-semibold text-slate-100 truncate group-hover:text-rose-400 transition-colors"
          >
            {photo.author}
          </h2>
        </div>

        {/* Minimal indicator pill if favourited */}
        {isFavourite && (
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            ★ Fav
          </span>
        )}
      </div>
    </article>
  );
}