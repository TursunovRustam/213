import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { cx } from '../../utils/cx';
import styles from './PageHeader.module.css';

// Шапка внутренней страницы: хлебные крошки, h1 и подзаголовок.
// breadcrumbs = [{ label, to }] — последний пункт без to (текущая страница)
export default function PageHeader({ title, lead, breadcrumbs, children, className }) {
  const { t } = useT();
  return (
    <header className={cx(styles.header, className)}>
      <div className="container">
        {breadcrumbs && (
          <nav aria-label={t('common.breadcrumbs')}>
            <ol className={styles.crumbs}>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label}>
                  {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
                  {index < breadcrumbs.length - 1 && <ChevronRight aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
        {children}
      </div>
    </header>
  );
}
