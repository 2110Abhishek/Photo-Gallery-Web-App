/**
 * LoadingSpinner.jsx
 * Accessible, animated loading indicator displayed while fetching photos.
 */
export default function LoadingSpinner({ message = 'Loading gallery photos...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-24 px-4"
    >
      <div className="relative w-16 h-16">
        {/* Background glow ring */}
        <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 animate-ping"></div>
        {/* Static outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-rose-500 animate-spin"></div>
      </div>
      <p className="mt-6 text-slate-300 font-medium tracking-wide text-sm md:text-base animate-pulse">
        {message}
      </p>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
