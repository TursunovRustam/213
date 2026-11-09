import { useState } from 'react';
import { useMatch } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { telegramLink, whatsappLink } from '../../config/site';
import { useT } from '../../i18n/useT';
import { cx } from '../../utils/cx';
import { TelegramIcon, WhatsAppIcon } from '../ui/BrandIcons';
import styles from './FloatingContact.module.css';

// Плавающая кнопка связи в правом нижнем углу
export default function FloatingContact() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  // На странице тура у телефона внизу закреплена панель бронирования — поднимаем кнопку
  const onTourPage = useMatch('/tours/:slug');

  return (
    <div className={cx(styles.root, onTourPage && styles.raised)}>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="list"
            className={styles.options}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <li>
              <a href={whatsappLink(t('contact.whatsappGreeting'))} target="_blank" rel="noreferrer" className={cx(styles.option, styles.whatsapp)}>
                <WhatsAppIcon /> WhatsApp
              </a>
            </li>
            <li>
              <a href={telegramLink()} target="_blank" rel="noreferrer" className={cx(styles.option, styles.telegram)}>
                <TelegramIcon /> Telegram
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-label={open ? t('contact.close') : t('contact.open')}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
      </button>
    </div>
  );
}
