import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { NAV_ITEMS } from '../../config/navigation';
import { site, telegramLink, whatsappLink } from '../../config/site';
import { useT } from '../../i18n/useT';
import { useEscape } from '../../hooks/useEscape';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import Button from '../ui/Button';
import { TelegramIcon, WhatsAppIcon } from '../ui/BrandIcons';
import LangSwitch from './LangSwitch';
import Logo from './Logo';
import styles from './MobileMenu.module.css';

const listVariants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  closed: {},
};

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  closed: { opacity: 0, y: 16 },
};

// Полноэкранное меню для телефонов и планшетов. Раскрывается кругом из угла бургера.
export default function MobileMenu({ id, open, onClose }) {
  const { t } = useT();
  const closeRef = useRef(null);

  useLockBodyScroll(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          className={`${styles.menu} on-dark`}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
          initial={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 44px) 36px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={`container ${styles.top}`}>
            <Logo onClick={onClose} />
            <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label={t('nav.closeMenu')}>
              <X aria-hidden="true" />
            </button>
          </div>

          <motion.nav className="container" aria-label={t('nav.label')} initial="closed" animate="open" variants={listVariants}>
            <ul role="list" className={styles.links}>
              {NAV_ITEMS.map((item) => (
                <motion.li key={item.key} variants={itemVariants}>
                  <Link to={item.to} className={styles.link} onClick={onClose}>
                    {t(item.key)}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={itemVariants}>
                <Link to="/my-bookings" className={styles.linkSmall} onClick={onClose}>
                  {t('nav.myBookings')}
                </Link>
              </motion.li>
            </ul>

            <motion.div className={styles.bottom} variants={itemVariants}>
              <LangSwitch size="lg" />
              <Button to="/tours" size="lg" block onClick={onClose}>
                {t('nav.book')}
              </Button>
              <div className={styles.contacts}>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className={styles.contact}>
                  <WhatsAppIcon /> WhatsApp
                </a>
                <a href={telegramLink()} target="_blank" rel="noreferrer" className={styles.contact}>
                  <TelegramIcon /> Telegram
                </a>
              </div>
              <p className={styles.phone}>{site.contacts.phone}</p>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
