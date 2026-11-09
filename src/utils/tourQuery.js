// Перевод фильтров каталога в адресную строку и обратно: /tours?region=bukhara&transfer=1
import { defaultFilters, DEFAULT_SORT, SORT_OPTIONS } from '../store/slices/toursSlice';

const toNumber = (value) => {
  if (value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export function parseTourQuery(searchParams) {
  const sort = searchParams.get('sort');
  return {
    filters: {
      query: searchParams.get('q') ?? '',
      region: searchParams.get('region') ?? 'all',
      durationType: searchParams.get('type') ?? 'all',
      priceMin: toNumber(searchParams.get('min')),
      priceMax: toNumber(searchParams.get('max')),
      transferOnly: searchParams.get('transfer') === '1',
      date: searchParams.get('date') ?? '',
      guests: toNumber(searchParams.get('guests')) ?? 0,
    },
    sort: SORT_OPTIONS.includes(sort) ? sort : DEFAULT_SORT,
  };
}

export function buildTourQuery(filters, sort = DEFAULT_SORT) {
  const params = new URLSearchParams();
  const f = { ...defaultFilters, ...filters };
  if (f.query.trim()) params.set('q', f.query);
  if (f.region !== 'all') params.set('region', f.region);
  if (f.durationType !== 'all') params.set('type', f.durationType);
  if (f.priceMin != null) params.set('min', String(f.priceMin));
  if (f.priceMax != null) params.set('max', String(f.priceMax));
  if (f.transferOnly) params.set('transfer', '1');
  if (f.date) params.set('date', f.date);
  if (f.guests) params.set('guests', String(f.guests));
  if (sort !== DEFAULT_SORT) params.set('sort', sort);
  return params.toString();
}
