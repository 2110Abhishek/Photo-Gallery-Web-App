# 🎬 Celebrare Frontend Internship — 5-Minute Demonstration Script

This document contains the exact, word-for-word presentation script for the mandatory 5-minute screen recording. It matches the required time distribution from **Section 9 of the PRD** and is designed to ensure you demonstrate and explain all required criteria clearly and confidently.

---

## 🕒 Video Timeline Overview

| Timestamp | Segment | Visual On Screen | Key Topics Covered |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:45** | **App Walkthrough** | Web Browser (`http://localhost:5173` or `5174`) | Initial loading spinner, 30 photos grid, responsive layouts (desktop, tablet, mobile), favourite toggling, and refresh persistence |
| **0:45 – 1:40** | **Custom Hook** | Editor: `src/hooks/useFetchPhotos.js` | Return contract `{ photos, loading, error }`, `AbortController` cleanup on unmount, HTTP status error handling |
| **1:40 – 2:40** | **Favourites Reducer** | Editor: `src/reducers/favouritesReducer.js` | Why `useReducer` was chosen, pure reducer function, `TOGGLE_FAVOURITE` action, immutable updates, safe `localStorage` initialization |
| **2:40 – 3:40** | **Search Optimization** | Editor: `src/components/Gallery.jsx` | `useCallback` for search handler, `useMemo` for filtered photo list, case-insensitive partial match, zero extra network requests |
| **3:40 – 5:00** | **Genuine Challenge & Solution** | Editor & Browser Side-by-Side | Coordinating `useReducer` with `localStorage` persistence while keeping the reducer pure |

---

## 🎙️ Word-for-Word Speaking Script

### ⏱️ Segment 1: Live App Demonstration (0:00 – 0:45)
**🖥️ On Screen:** Web browser with the running app (`http://localhost:5173` or `http://localhost:5174`).

> *"Hello! My name is Abhishek, and this is my submission for the Celebrare Frontend React Internship — the Photo Gallery Web App.
>
> Let's refresh the page to observe the initial load. Notice the animated loading spinner while 30 photos are fetched from the Picsum Photos API. Once resolved, the photos populate our responsive grid.
>
> On desktop, we display a 4-column layout. When I resize the browser down to tablet width, it transitions smoothly into 2 columns, and down to mobile width, it adjusts into a single-column layout.
>
> Each card displays the photographer's name, an optimized 4:3 aspect ratio image with smooth fallback handling, and an interactive heart button. 
>
> When I click the heart on the first photo, it immediately lights up rose-red, and our header counter updates to 'Favourites: 1'. Let's favourite a second photo.
>
> Now, I will refresh the browser page. As you can see, once the gallery reloads, both photos remain favorited because our state is persistently synchronized with localStorage. Clicking an active heart immediately removes it from favourites."*

---

### ⏱️ Segment 2: Custom Hook — `useFetchPhotos.js` (0:45 – 1:40)
**🖥️ On Screen:** VS Code with [src/hooks/useFetchPhotos.js](file:///d:/Photo%20Gallery%20Web%20App/src/hooks/useFetchPhotos.js) open.

> *"Now let's dive into the code. The assignment mandates separating data fetching from presentation using a custom hook.
>
> In `src/hooks/useFetchPhotos.js`, our hook returns an object with exactly three named properties: `photos`, `loading`, and `error`. 
>
> Inside the `useEffect`, we instantiate a native browser `AbortController`. The fetch request calls `https://picsum.photos/v2/list?limit=30` with `signal` attached. 
>
> Notice our failure handling: the native `fetch` API does not automatically reject HTTP error codes like 404 or 500, so we explicitly check `response.ok`. If false, we throw an error with the HTTP status. We also validate that the received data is an Array before updating state.
>
> Most importantly, in the cleanup return function, we call `controller.abort()`. If the component unmounts while the network request is still in flight, it cancels the request and ignores `AbortError`. This prevents updating unmounted state and completely eliminates memory leaks."*

---

### ⏱️ Segment 3: Favourites State Management — `useReducer` (1:40 – 2:40)
**🖥️ On Screen:** VS Code with [src/reducers/favouritesReducer.js](file:///d:/Photo%20Gallery%20Web%20App/src/reducers/favouritesReducer.js) open.

> *"For favourites management, the PRD explicitly requires React's `useReducer` rather than `useState`. 
>
> Here in `favouritesReducer.js`, our state shape is a clean, minimal array of photo ID strings—for example, `['0', '1', '10']`. Storing only IDs avoids duplicating large photo objects in memory.
>
> Our reducer is a 100% pure function. It handles the `TOGGLE_FAVOURITE` action. If the ID is already present in the array, it returns a new array filtered without that ID. If it is not present, it returns a new array with the ID appended using the spread operator. At no point is the existing state array mutated.
>
> To handle persistence safely, we created `initFavourites()`. When initializing the reducer, it safely parses `localStorage.getItem` within a `try-catch` block and validates that the parsed output is actually an array. If `localStorage` is empty, corrupted, or contains malformed JSON, it gracefully returns an empty array rather than crashing the app."*

---

### ⏱️ Segment 4: Search Optimization — `useCallback` & `useMemo` (2:40 – 3:40)
**🖥️ On Screen:** VS Code with [src/components/Gallery.jsx](file:///d:/Photo%20Gallery%20Web%20App/src/components/Gallery.jsx) open (highlight lines 47–68).

> *"Next, let's examine the real-time author search in `Gallery.jsx`. Both `useCallback` and `useMemo` are mandatory here.
>
> First, our `handleSearch` input handler is wrapped in `useCallback` with an empty dependency array because `setSearchQuery` is a stable state setter provided by React. This guarantees a stable function reference across re-renders.
>
> Second, our filtered photo list is computed using `useMemo`:
>
> `const filteredPhotos = useMemo(() => { ... }, [photos, searchQuery]);`
>
> This recalculates only when the raw `photos` array or `searchQuery` string changes. It trims whitespace, converts the query to lowercase, and filters author names case-insensitively.
>
> Crucially, searching operates entirely client-side on the already-fetched 30 photos. It never triggers additional network requests. 
>
> If the search query doesn't match any author, `filteredPhotos` length is zero, and we render a dedicated 'No photos found' state with a clear-search button that immediately resets the query."*

---

### ⏱️ Segment 5: Implementation Challenge & Solution (3:40 – 5:00)
**🖥️ On Screen:** Split screen or show `Gallery.jsx` (`useReducer` and `useEffect` block) alongside the browser.

> *"Finally, I would like to discuss the most genuine implementation challenge of this assignment: **coordinating `useReducer` with `localStorage` persistence while strictly keeping the reducer pure**.
>
> A common mistake is placing side effects like `localStorage.setItem` directly inside the reducer function. However, reducers in React must remain pure functions without side effects.
>
> To solve this cleanly, we separated concerns into three distinct steps:
> 1. **Lazy Initialization:** We passed `initFavourites` as the third parameter to `useReducer` in `Gallery.jsx`. This reads and safely validates `localStorage` once upon mounting.
> 2. **Pure State Transitions:** The reducer strictly computes the next array of IDs immutably.
> 3. **Side-Effect Synchronization:** In `Gallery.jsx`, we use a dedicated `useEffect` listening to `[favourites]`. Whenever the reducer state changes, it serializes and saves the updated IDs into `localStorage`.
>
> This guarantees instant UI updates, perfect persistence across browser sessions, zero crashes on corrupted data, and an architectural separation of concerns that adheres to React best practices.
>
> All 24 acceptance criteria have been implemented and verified with zero external component libraries. Thank you for reviewing my submission!"*

---

## 📝 Google Form Submission Helper

When filling out your assignment submission Google Form:

- **Repository Link:** `https://github.com/2110Abhishek/Photo-Gallery-Web-App`
- **Video Recording Link:** `[Paste your unlisted YouTube or Google Drive link here]`
- **Hardest Part Description (One-liner):**
  > *"The most challenging part was coordinating useReducer with localStorage so that favourite selections update immediately and persist correctly after refreshing the page, while strictly keeping the reducer function pure."*
