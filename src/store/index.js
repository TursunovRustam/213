import { configureStore } from '@reduxjs/toolkit';
import toursReducer from './slices/toursSlice';
import bookingReducer from './slices/bookingSlice';
import favoritesReducer from './slices/favoritesSlice';
import settingsReducer, { SUPPORTED_LANGS } from './slices/settingsSlice';

// В localStorage сохраняются: язык, избранное, брони и черновик брони.
// Если поменяете структуру данных, увеличьте версию ключа (v1 → v2).
const STORAGE_KEY = 'uzbekistan-dreams:v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const saved = JSON.parse(raw);
    const settings = settingsReducer(undefined, { type: '@@init' });
    const booking = bookingReducer(undefined, { type: '@@init' });
    return {
      settings: {
        ...settings,
        lang: SUPPORTED_LANGS.includes(saved.lang) ? saved.lang : settings.lang,
      },
      favorites: { ids: Array.isArray(saved.favorites) ? saved.favorites : [] },
      booking: {
        ...booking,
        draft: saved.draft ? { ...booking.draft, ...saved.draft } : booking.draft,
        bookings: Array.isArray(saved.bookings) ? saved.bookings : [],
      },
    };
  } catch {
    return undefined;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lang: state.settings.lang,
        favorites: state.favorites.ids,
        draft: state.booking.draft,
        bookings: state.booking.bookings,
      }),
    );
  } catch {
    // localStorage может быть недоступен (приватный режим) — просто не сохраняем
  }
}

// Не чаще одного раза за wait мс, последний вызов не теряется
function throttle(fn, wait) {
  let lastRun = 0;
  let timer = null;
  return () => {
    const remaining = wait - (Date.now() - lastRun);
    if (remaining <= 0) {
      clearTimeout(timer);
      timer = null;
      lastRun = Date.now();
      fn();
    } else if (!timer) {
      timer = setTimeout(() => {
        lastRun = Date.now();
        timer = null;
        fn();
      }, remaining);
    }
  };
}

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    booking: bookingReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
  },
  preloadedState: loadState(),
  // Список туров большой и не меняется — не проверяем его в режиме разработки (быстрее)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredPaths: ['tours.items'], ignoredActions: ['tours/fetchTours/fulfilled'] },
      immutableCheck: { ignoredPaths: ['tours.items'] },
    }),
});

store.subscribe(throttle(() => saveState(store.getState()), 500));
