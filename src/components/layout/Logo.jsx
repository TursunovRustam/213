import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { useT } from '../../i18n/useT';
import { cx } from '../../utils/cx';
import styles from './Logo.module.css';

// Логотип: арка с восьмиконечной звездой + название бренда из config/site.js
export default function Logo({ onClick, className }) {
  const { t } = useT();
  return (
    <Link to="/" className={cx(styles.logo, className)} onClick={onClick} aria-label={t('nav.home', { brand: site.brand })}>
      <svg className={styles.mark} viewBox="0 0 40 48" aria-hidden="true">
        <path d="M4 46V20Q4 8 20 2Q36 8 36 20V46Z" className={styles.arch} />
        <g transform="translate(20 26)" className={styles.star}>
          <rect x="-6" y="-6" width="12" height="12" />
          <rect x="-6" y="-6" width="12" height="12" transform="rotate(45)" />
        </g>
      </svg>
      <span className={styles.text}>{site.brand}</span>
    </Link>
  );
}
