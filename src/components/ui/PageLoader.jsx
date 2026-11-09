import { useT } from '../../i18n/useT';
import styles from './PageLoader.module.css';

// Индикатор загрузки страницы (пока туры загружаются)
export default function PageLoader() {
  const { t } = useT();
  return (
    <div className={styles.loader} role="status">
      <svg viewBox="0 0 40 48" className={styles.mark} aria-hidden="true">
        <path d="M4 46V20Q4 8 20 2Q36 8 36 20V46Z" />
      </svg>
      <span className="visually-hidden">{t('common.loading')}</span>
    </div>
  );
}
