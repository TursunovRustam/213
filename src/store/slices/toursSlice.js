import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { tours as toursData } from '../../data/tours';
import { durationType } from '../../utils/pricing';

export const SORT_OPTIONS = ['popular', 'price-asc', 'price-desc', 'rating'];
export const DEFAULT_SORT = 'popular';

export const defaultFilters = {
  query: '',
  region: 'all', // bukhara | samarkand | khiva | tashkent | desert | multi | all
  durationType: 'all', // short | full-day | multi-day | all
  priceMin: null,
  priceMax: null,
  transferOnly: false,
  date: '', // дата из поиска на главной (подставляется в бронирование)
  guests: 0, // гости из поиска на главной
};

// Загрузка туров. Сейчас они берутся из src/data/tours.js.
// Когда появится API, замените тело функции, например:
//   const response = await fetch(`${import.meta.env.VITE_API_URL}/tours`);
//   return await response.json();
// Компоненты переписывать не придётся: они читают туры через селекторы ниже.
export const fetchTours = createAsyncThunk(
  'tours/fetchTours',
  async () => toursData,
  { condition: (_, { getState }) => getState().tours.status === 'idle' },
);

const toursSlice = createSlice({
  name: 'tours',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    filters: defaultFilters,
    sort: DEFAULT_SORT,
  },
  reducers: {
    // Изменение фильтров пользователем (поиск, чипы, ползунок цены)
    setFilters(state, action) {
      Object.assign(state.filters, action.payload);
    },
    setSort(state, action) {
      state.sort = SORT_OPTIONS.includes(action.payload) ? action.payload : DEFAULT_SORT;
    },
    // Фильтры из адресной строки: при открытии /tours?region=… и кнопках «назад/вперёд»
    applyQuery(state, action) {
      const { filters, sort } = action.payload;
      Object.assign(state.filters, filters);
      state.sort = sort;
    },
    resetFilters(state) {
      state.filters = defaultFilters;
      state.sort = DEFAULT_SORT;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load tours';
      });
  },
});

export const { setFilters, setSort, applyQuery, resetFilters } = toursSlice.actions;
export default toursSlice.reducer;

// ---------- Селекторы ----------

export const selectToursStatus = (state) => state.tours.status;
export const selectFilters = (state) => state.tours.filters;
export const selectSort = (state) => state.tours.sort;
const selectAllTours = (state) => state.tours.items;

// Только туры с active: true
export const selectActiveTours = createSelector([selectAllTours], (tours) =>
  tours.filter((tour) => tour.active),
);

export const selectTourBySlug = (state, slug) =>
  selectActiveTours(state).find((tour) => tour.slug === slug);

const popularity = (tour) =>
  tour.reviewsCount * tour.rating + (tour.badges.includes('bestseller') ? 500 : 0);

const sorters = {
  popular: (a, b) => popularity(b) - popularity(a),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
};

function matchesFilters(tour, filters, ignore) {
  const query = filters.query.trim().toLowerCase();
  if (query) {
    const haystack = `${tour.title.en} ${tour.title.ru}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (ignore !== 'region' && filters.region !== 'all' && tour.region !== filters.region) return false;
  if (filters.durationType !== 'all' && durationType(tour) !== filters.durationType) return false;
  if (filters.priceMin != null && tour.price < filters.priceMin) return false;
  if (filters.priceMax != null && tour.price > filters.priceMax) return false;
  if (filters.transferOnly && !tour.transfer) return false;
  if (filters.guests && tour.maxGroupSize < filters.guests) return false;
  return true;
}

export const selectFilteredTours = createSelector(
  [selectActiveTours, selectFilters, selectSort],
  (tours, filters, sort) =>
    tours.filter((tour) => matchesFilters(tour, filters)).sort(sorters[sort] ?? sorters.popular),
);

// Сколько туров в каждом регионе с учётом остальных фильтров (для чипов фильтра)
export const selectRegionCounts = createSelector([selectActiveTours, selectFilters], (tours, filters) =>
  tours
    .filter((tour) => matchesFilters(tour, filters, 'region'))
    .reduce((acc, tour) => ({ ...acc, [tour.region]: (acc[tour.region] ?? 0) + 1 }), {}),
);

// Регионы, в которых есть активные туры (для поиска на главной и направлений)
export const selectTourCountByRegion = createSelector([selectActiveTours], (tours) =>
  tours.reduce((acc, tour) => ({ ...acc, [tour.region]: (acc[tour.region] ?? 0) + 1 }), {}),
);

export const selectPriceBounds = createSelector([selectActiveTours], (tours) => {
  if (!tours.length) return { min: 0, max: 0 };
  const prices = tours.map((tour) => tour.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
});

// Популярные туры для главной: сначала бухарские хиты
export const selectPopularTours = createSelector([selectActiveTours], (tours) =>
  [...tours]
    .sort((a, b) => Number(a.outsideBukhara) - Number(b.outsideBukhara) || sorters.popular(a, b))
    .slice(0, 6),
);

export const selectOutsideBukharaTours = createSelector([selectActiveTours], (tours) =>
  tours.filter((tour) => tour.outsideBukhara).sort(sorters.popular),
);

export const selectSimilarTours = createSelector(
  [selectActiveTours, (_, tour) => tour],
  (tours, current) => {
    if (!current) return [];
    return tours
      .filter((tour) => tour.id !== current.id)
      .map((tour) => ({
        tour,
        score: (tour.region === current.region ? 2 : 0) + (tour.category === current.category ? 1 : 0),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || sorters.popular(a.tour, b.tour))
      .slice(0, 3)
      .map((item) => item.tour);
  },
);

// Общий рейтинг и число отзывов для полосы доверия
export const selectTrustStats = createSelector([selectActiveTours], (tours) => {
  const reviews = tours.reduce((sum, tour) => sum + tour.reviewsCount, 0);
  const weighted = tours.reduce((sum, tour) => sum + tour.rating * tour.reviewsCount, 0);
  return { reviews, rating: reviews ? Math.round((weighted / reviews) * 10) / 10 : 5 };
});
