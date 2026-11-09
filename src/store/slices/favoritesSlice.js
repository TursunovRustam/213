import { createSelector, createSlice } from '@reduxjs/toolkit';
import { selectActiveTours } from './toursSlice';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { ids: [] },
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      state.ids = state.ids.includes(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id];
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export const selectFavoriteIds = (state) => state.favorites.ids;
export const selectIsFavorite = (state, id) => state.favorites.ids.includes(id);

export const selectFavoriteTours = createSelector([selectActiveTours, selectFavoriteIds], (tours, ids) =>
  ids.map((id) => tours.find((tour) => tour.id === id)).filter(Boolean),
);

// Считаем только туры, которые всё ещё активны
export const selectFavoritesCount = (state) => selectFavoriteTours(state).length;
