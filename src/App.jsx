import Gallery from './components/Gallery';

/**
 * App.jsx
 * Root application shell for the Celebrare Photo Gallery Web App.
 *
 * Requirements:
 * - Clean neutral/dark aesthetic
 * - Title and subtitle matching PRD specification
 * - Main responsive container
 * - Houses the Gallery component
 */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500/30 selection:text-rose-200">
      {/* Decorative subtle ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-rose-600/10 via-purple-600/5 to-transparent blur-3xl opacity-60 rounded-full" />
      </div>

      {/* Header */}
      <header className="pt-12 pb-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          Celebrare Frontend Internship Assignment
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          Photo Gallery
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-md mx-auto">
          Discover beautiful photography
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Gallery />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-400">
        <p>
          Photos powered by{' '}
          <a
            href="https://picsum.photos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-rose-400 underline underline-offset-2 transition-colors"
          >
            Picsum Photos API
          </a>
          . Built with React &amp; Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}