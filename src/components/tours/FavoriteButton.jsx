import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { selectIsFavorite, toggleFavorite } from '../../store/slices/favoritesSlice';
import { cx } from '../../utils/cx';
import styles from './FavoriteButton.module.css';

// Сердечко «в избранное». variant: overlay (круглая кнопка на фото) | inline (с подписью)
export default function FavoriteButton({ tourId, tourTitle, variant = 'overlay', className }) {
  const { t } = useT();
  const dispatch = useDispatch();
  const isFavorite = useSelector((state) => selectIsFavorite(state, tourId));
  const label = isFavorite ? t('favorites.remove') : t('favorites.add');

  return (
    <button
      type="button"
      className={cx(styles.button, styles[variant], isFavorite && styles.active, className)}
      aria-pressed={isFavorite}
      aria-label={variant === 'overlay' ? `${label}: ${tourTitle}` : undefined}
      onClick={() => dispatch(toggleFavorite(tourId))}
    >
      <motion.span
        key={isFavorite ? 'on' : 'off'}
        className={styles.icon}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        <Heart aria-hidden="true" />
      </motion.span>
      {variant === 'inline' && <span>{isFavorite ? t('favorites.saved') : t('favorites.save')}</span>}
    </button>
  );
}
