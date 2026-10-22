/**
 * favouritesReducer.js
 * Reducer for managing favourite photo IDs in the Photo Gallery Web App.
 *
 * Requirements:
 * - State shape: Array of photo IDs (e.g. ["10", "22", "35"])
 * - Action: TOGGLE_FAVOURITE
 * - Pure function: no direct localStorage access or side effects in the reducer
 * - Immutable array updates
 * - Safe initializer reading from localStorage with fallback to []
 */

export const STORAGE_KEY = 'photo-gallery-favourites';

export const FAVOURITES_ACTIONS = {
  TOGGLE_FAVOURITE: 'TOGGLE_FAVOURITE',
};

/**
 * Safely initializes the favourites state from localStorage.
 * Handles missing keys, malformed JSON, and invalid non-array structures gracefully.
 *
 * @param {Array} defaultState - Fallback initial state if storage is empty or invalid
 * @returns {Array<string|number>} Validated array of favourite photo IDs
 */
export function initFavourites(defaultState = []) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultState;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      // Ensure all IDs are strings/numbers and remove any accidental duplicates
      const validIds = parsed.filter(
        (id) => typeof id === 'string' || typeof id === 'number'
      );
      return Array.from(new Set(validIds.map(String)));
    }
    return defaultState;
  } catch (err) {
    console.warn('Failed to parse favourites from localStorage. Resetting to empty.', err);
    return defaultState;
  }
}

/**
 * Pure reducer function for toggling favourite photo IDs.
 *
 * @param {Array<string>} state - Current array of favourite photo IDs
 * @param {Object} action - Action object containing type and photo id
 * @returns {Array<string>} New array of favourite photo IDs
 */
export function favouritesReducer(state, action) {
  switch (action.type) {
    case FAVOURITES_ACTIONS.TOGGLE_FAVOURITE: {
      const id = String(action.id ?? action.payload);
      if (!id) {
        return state;
      }
      const isFav = state.includes(id);
      if (isFav) {
        // Return a new array without the photo ID (immutable update)
        return state.filter((favId) => favId !== id);
      } else {
        // Return a new array with the photo ID appended (immutable update)
        return [...state, id];
      }
    }
    default:
      return state;
  }
}
