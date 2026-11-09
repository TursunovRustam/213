import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useT } from '../i18n/useT';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  applyQuery,
  DEFAULT_SORT,
  resetFilters,
  selectFilteredTours,
  selectFilters,
  selectPriceBounds,
  selectRegionCounts,
  selectSort,
  selectToursStatus,
  setFilters,
  setSort,
  SORT_OPTIONS,
} from '../store/slices/toursSlice';
import { buildTourQuery, parseTourQuery } from '../utils/tourQuery';
import TourFilters from '../components/tours/TourFilters';
import TourGrid from '../components/tours/TourGrid';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import Ornament from '../components/ui/Ornament';
import PageHeader from '../components/ui/PageHeader';
import styles from './Tours.module.css';

// Сколько фильтров включено (для бейджа на кнопке «Фильтры»)
function countActiveFilters(filters) {
  return [
    filters.region !== 'all',
    filters.durationType !== 'all',
    filters.priceMin != null || filters.priceMax != null,
    filters.transferOnly,
    filters.guests > 0,
  ].filter(Boolean).length;
}

export default function Tours() {
  const { t, tp } = useT();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useSelector(selectFilters);
  const sort = useSelector(selectSort);
  const tours = useSelector(selectFilteredTours);
  const regionCounts = useSelector(selectRegionCounts);
  const bounds = useSelector(selectPriceBounds);
  const status = useSelector(selectToursStatus);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [sheetOpen, setSheetOpen] = useState(false);

  usePageMeta(t('meta.tours.title'), t('meta.tours.description'));

  // Синхронизация фильтров с адресной строкой.
  // 1) Адрес → Redux: при открытии страницы, кнопках «назад/вперёд» и ссылках вида /tours?region=…
  // 2) Redux → адрес: после того как гость сам поменял фильтр (флаг userChange)
  const userChange = useRef(false);

  useEffect(() => {
    dispatch(applyQuery(parseTourQuery(searchParams)));
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (!userChange.current) return;
    userChange.current = false;
    setSearchParams(buildTourQuery(filters, sort), { replace: true });
  }, [filters, sort, setSearchParams]);

  const updateFilters = (patch) => {
    userChange.current = true;
    dispatch(setFilters(patch));
  };

  const updateSort = (value) => {
    userChange.current = true;
    dispatch(setSort(value));
  };

  const handleReset = () => {
    userChange.current = true;
    dispatch(resetFilters());
  };

  const activeCount = countActiveFilters(filters);
  const hasActiveFilters = activeCount > 0 || filters.query.trim() !== '' || sort !== DEFAULT_SORT;

  const filterPanel = (
    <TourFilters
      filters={filters}
      regionCounts={regionCounts}
      bounds={bounds}
      onChange={updateFilters}
      onReset={handleReset}
      hasActiveFilters={hasActiveFilters}
    />
  );

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('tours.title')}
        lead={t('tours.lead')}
        breadcrumbs={[{ label: t('common.home'), to: '/' }, { label: t('nav.tours') }]}
      />

      <div className={`container ${styles.layout}`}>
        {isDesktop && (
          <aside className={styles.sidebar} aria-label={t('filters.title')}>
            <h2 className={styles.sidebarTitle}>{t('filters.title')}</h2>
            {filterPanel}
          </aside>
        )}

        <div className={styles.results}>
          <div className={styles.toolbar}>
            <div className={styles.search}>
              <Search aria-hidden="true" className={styles.searchIcon} />
              <label htmlFor="tour-search" className="visually-hidden">
                {t('tours.searchLabel')}
              </label>
              <input
                id="tour-search"
                type="search"
                className={`input ${styles.searchInput}`}
                placeholder={t('tours.searchPlaceholder')}
                value={filters.query}
                onChange={(event) => updateFilters({ query: event.target.value })}
              />
              {filters.query && (
                <button type="button" className={styles.clearSearch} onClick={() => updateFilters({ query: '' })} aria-label={t('tours.clearSearch')}>
                  <X aria-hidden="true" />
                </button>
              )}
            </div>

            {!isDesktop && (
              <button type="button" className={styles.filterButton} onClick={() => setSheetOpen(true)}>
                <SlidersHorizontal aria-hidden="true" />
                {t('filters.title')}
                {activeCount > 0 && <span className={styles.filterCount}>{activeCount}</span>}
              </button>
            )}

            <div className={styles.sort}>
              <label htmlFor="tour-sort" className={styles.sortLabel}>
                {t('tours.sortLabel')}
              </label>
              <select id="tour-sort" className={`input ${styles.sortSelect}`} value={sort} onChange={(event) => updateSort(event.target.value)}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t(`tours.sort.${option}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className={styles.count} aria-live="polite">
            {status === 'succeeded' && tp('tours.found', tours.length)}
          </p>

          {status === 'succeeded' && tours.length === 0 ? (
            <div className={styles.empty}>
              <Ornament />
              <h2 className={styles.emptyTitle}>{t('tours.emptyTitle')}</h2>
              <p>{t('tours.emptyText')}</p>
              <Button onClick={handleReset}>{t('filters.reset')}</Button>
            </div>
          ) : (
            <TourGrid tours={tours} loading={status !== 'succeeded'} layout="sidebar" />
          )}
        </div>
      </div>

      {!isDesktop && (
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title={t('filters.title')}
          footer={
            <Button block size="lg" onClick={() => setSheetOpen(false)}>
              {tp('filters.show', tours.length)}
            </Button>
          }
        >
          {filterPanel}
        </BottomSheet>
      )}
    </div>
  );
}
