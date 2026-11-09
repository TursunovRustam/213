import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { useT } from '../i18n/useT';
import { usePageMeta } from '../hooks/usePageMeta';
import { selectFavoriteTours } from '../store/slices/favoritesSlice';
import { selectToursStatus } from '../store/slices/toursSlice';
import TourGrid from '../components/tours/TourGrid';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import styles from './Favorites.module.css';

export default function Favorites() {
  const { t, tp } = useT();
  const tours = useSelector(selectFavoriteTours);
  const status = useSelector(selectToursStatus);
  usePageMeta(t('meta.favorites.title'), t('meta.favorites.description'));

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('favorites.title')}
        lead={tours.length ? tp('plural.tours', tours.length) : null}
        breadcrumbs={[{ label: t('common.home'), to: '/' }, { label: t('favorites.title') }]}
      />
      <div className={`container ${styles.content}`}>
        {status === 'succeeded' && tours.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              <Heart />
            </span>
            <h2>{t('favorites.emptyTitle')}</h2>
            <p>{t('favorites.emptyText')}</p>
            <Button to="/tours">{t('favorites.browse')}</Button>
          </div>
        ) : (
          <TourGrid tours={tours} loading={status !== 'succeeded'} skeletonCount={3} />
        )}
      </div>
    </div>
  );
}
