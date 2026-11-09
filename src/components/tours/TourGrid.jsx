import { cx } from '../../utils/cx';
import TourCard from './TourCard';
import styles from './TourGrid.module.css';

// Сетка карточек. layout: default (до 3 колонок) | sidebar (рядом с фильтрами)
export default function TourGrid({ tours, loading = false, layout = 'default', skeletonCount = 6 }) {
  if (loading) {
    return (
      <ul role="list" className={cx(styles.grid, styles[layout])} aria-busy="true">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <li key={index} className={styles.skeleton} />
        ))}
      </ul>
    );
  }

  return (
    <ul role="list" className={cx(styles.grid, styles[layout])}>
      {tours.map((tour) => (
        <li key={tour.id}>
          <TourCard tour={tour} />
        </li>
      ))}
    </ul>
  );
}
