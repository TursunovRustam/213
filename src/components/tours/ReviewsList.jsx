import { Link } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { cx } from '../../utils/cx';
import { Stars } from '../ui/Rating';
import styles from './ReviewsList.module.css';

// Список отзывов (на странице тура)
export default function ReviewsList({ reviews, tours = [] }) {
  return (
    <ul role="list" className={styles.list}>
      {reviews.map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} tour={tours.find((tour) => tour.id === review.tourId)} />
        </li>
      ))}
    </ul>
  );
}

// Карточка одного отзыва. tour — если передан, под текстом показывается ссылка на тур
export function ReviewCard({ review, tour, onDark = false, clamp = false }) {
  const { tr, fmt } = useT();
  return (
    <figure className={cx(styles.card, onDark && styles.onDark)}>
      <Stars value={review.rating} />
      <blockquote className={cx(styles.text, clamp && styles.clamp)}>
        <p>{tr(review.text)}</p>
      </blockquote>
      <figcaption className={styles.author}>
        <span className={styles.avatar} aria-hidden="true">
          {review.name.charAt(0)}
        </span>
        <span className={styles.meta}>
          <strong>{review.name}</strong>
          <span>
            {fmt.country(review.country)} · {fmt.date(review.date, { month: 'long', year: 'numeric' })}
          </span>
          {tour && (
            <Link to={`/tours/${tour.slug}`} className={styles.tour}>
              {tr(tour.title)}
            </Link>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
