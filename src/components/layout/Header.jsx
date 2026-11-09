import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Heart, Menu } from 'lucide-react';
import { NAV_ITEMS } from '../../config/navigation';
import { useT } from '../../i18n/useT';
import { useScrolled } from '../../hooks/useScrolled';
import { selectFavoritesCount } from '../../store/slices/favoritesSlice';
import { cx } from '../../utils/cx';
import Button from '../ui/Button';
import LangSwitch from './LangSwitch';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

// Шапка: прозрачная поверх hero на главной, плотная после прокрутки и на остальных страницах
export default function Header() {
  const { t } = useT();
  const { pathname } = useLocation();
  const scrolled = useScrolled(24);
  const favoritesCount = useSelector(selectFavoritesCount);
  const [menuOpen, setMenuOpen] = useState(false);

  const transparent = pathname === '/' && !scrolled;

  return (
    <header className={cx(styles.header, transparent ? styles.transparent : styles.solid)}>
      <div className={cx('container', styles.inner)}>
        <Logo />

        <nav className={styles.nav} aria-label={t('nav.label')}>
          <ul role="list" className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                {item.isRoute ? (
                  <NavLink to={item.to} className={({ isActive }) => cx(styles.navLink, isActive && styles.active)}>
                    {t(item.key)}
                  </NavLink>
                ) : (
                  <Link to={item.to} className={styles.navLink}>
                    {t(item.key)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LangSwitch className={styles.lang} />
          <Link
            to="/favorites"
            className={styles.iconButton}
            aria-label={t('nav.favoritesWithCount', { count: favoritesCount })}
          >
            <Heart aria-hidden="true" />
            {favoritesCount > 0 && (
              <span className={styles.count} aria-hidden="true">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Button to="/tours" size="sm" className={styles.cta}>
            {t('nav.book')}
          </Button>
          <button
            type="button"
            className={cx(styles.iconButton, styles.burger)}
            aria-label={t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu id="mobile-menu" open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
