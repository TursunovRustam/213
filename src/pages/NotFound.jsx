import { useT } from '../i18n/useT';
import { usePageMeta } from '../hooks/usePageMeta';
import ArchFrame from '../components/ui/ArchFrame';
import Button from '../components/ui/Button';
import SmartImage from '../components/ui/SmartImage';
import styles from './NotFound.module.css';

// Страница 404 в стиле сайта: арка с пустынным пейзажем
export default function NotFound() {
  const { t } = useT();
  usePageMeta(t('meta.notFound.title'), t('meta.notFound.description'));

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.art}>
        <ArchFrame ratio={3 / 4} outline>
          <SmartImage scene="desert" tone="dusk" alt="" showLabel={false} />
        </ArchFrame>
        <span className={styles.code} aria-hidden="true">
          404
        </span>
      </div>
      <div className={styles.text}>
        <h1 className={styles.title}>{t('notFound.title')}</h1>
        <p className={styles.lead}>{t('notFound.text')}</p>
        <div className={styles.actions}>
          <Button to="/" size="lg">
            {t('notFound.home')}
          </Button>
          <Button to="/tours" variant="secondary" size="lg">
            {t('notFound.tours')}
          </Button>
        </div>
      </div>
    </div>
  );
}
