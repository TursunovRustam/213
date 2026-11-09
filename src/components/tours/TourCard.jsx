import { Link } from 'react-router-dom';
import { Bus, Clock } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { discountPercent, sceneForTour } from '../../utils/pricing';
import Badge from '../ui/Badge';
import Price from '../ui/Price';
import Rating from '../ui/Rating';
import SmartImage from '../ui/SmartImage';
import FavoriteButton from './FavoriteButton';
import styles from './TourCard.module.css';

// Карточка тура: фото 4:3, бейджи, сердечко, регион, название, длительность, трансфер, рейтинг и цена
export default function TourCard({ tour }) {
  const { t, tr, fmt } = useT();
  const cover = tour.images[0];
  const discount = discountPercent(tour);
  const title = tr(tour.title);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <SmartImage
          src={cover?.src}
          alt={tr(cover?.alt)}
          label={tr(cover?.alt)}
          scene={sceneForTour(tour)}
          className={styles.image}
        />
        <div className={styles.badges}>
          {tour.badges.map((badge) => (
            <Badge key={badge} variant={badge}>
              {t(`badges.${badge}`)}
            </Badge>
          ))}
          {discount > 0 && <Badge variant="sale">−{discount}%</Badge>}
        </div>
        <FavoriteButton tourId={tour.id} tourTitle={title} className={styles.favorite} />
      </div>

      <div className={styles.body}>
        <p className={styles.region}>{t(`regions.${tour.region}`)}</p>
        <h3 className={styles.title}>
          <Link to={`/tours/${tour.slug}`} className={styles.link}>
            {title}
          </Link>
        </h3>
        <ul role="list" className={styles.facts}>
          <li>
            <Clock aria-hidden="true" />
            {fmt.duration(tour.duration)}
          </li>
          {tour.transfer && (
            <li className={styles.transfer}>
              <Bus aria-hidden="true" />
              {t('tour.transferShort')}
            </li>
          )}
        </ul>
        <div className={styles.footer}>
          <Rating value={tour.rating} count={tour.reviewsCount} compact />
          <Price amount={tour.price} oldAmount={tour.oldPrice} size="sm" perPerson={false} />
        </div>
      </div>
    </article>
  );
}
