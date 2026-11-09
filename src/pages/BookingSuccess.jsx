import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, ListChecks } from 'lucide-react';
import { site, telegramLink, whatsappLink } from '../config/site';
import { useT } from '../i18n/useT';
import { usePageMeta } from '../hooks/usePageMeta';
import { selectBookingByCode } from '../store/slices/bookingSlice';
import { buildBookingMessage } from '../utils/bookingMessage';
import Button from '../components/ui/Button';
import { TelegramIcon, WhatsAppIcon } from '../components/ui/BrandIcons';
import Ornament from '../components/ui/Ornament';
import styles from './BookingSuccess.module.css';

export default function BookingSuccess() {
  const { code } = useParams();
  const i18n = useT();
  const { t, tp, tr, fmt } = i18n;
  const booking = useSelector((state) => selectBookingByCode(state, code));
  const [copied, setCopied] = useState(false);

  usePageMeta(t('meta.success.title'), t('meta.success.description'));

  if (!booking) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t('success.notFoundTitle')}</h1>
          <p className={styles.text}>{t('success.notFoundText', { code })}</p>
          <Button to="/my-bookings">{t('nav.myBookings')}</Button>
        </div>
      </div>
    );
  }

  const message = buildBookingMessage(booking, i18n);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(booking.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // буфер обмена недоступен — код и так виден на экране
    }
  };

  // В Telegram нельзя передать текст в личный чат, поэтому копируем его заранее
  const openTelegram = () => {
    navigator.clipboard?.writeText(message).catch(() => {});
  };

  const guests = [tp('plural.adults', booking.adults)];
  if (booking.children) guests.push(tp('plural.children', booking.children));

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <svg className={styles.check} viewBox="0 0 80 80" aria-hidden="true">
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            className={styles.checkCircle}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
          <motion.path
            d="M24 41l11 11 21-23"
            className={styles.checkMark}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.6, ease: 'easeOut' }}
          />
        </svg>

        <h1 className={styles.title}>{t('success.title')}</h1>
        <p className={styles.text}>
          {booking.delivered ? t('success.textSent', { name: tr(site.guide.firstName) }) : t('success.textLocal', { name: tr(site.guide.firstName) })}
        </p>

        <div className={styles.codeBox}>
          <span className={styles.codeLabel}>{t('success.code')}</span>
          <strong className={styles.code}>{booking.code}</strong>
          <button type="button" className={styles.copy} onClick={copyCode}>
            <Copy aria-hidden="true" />
            {copied ? t('success.copied') : t('success.copy')}
          </button>
        </div>

        <dl className={styles.summary}>
          <div>
            <dt>{t('success.message.tour')}</dt>
            <dd>{tr(booking.tourTitle)}</dd>
          </div>
          <div>
            <dt>{t('success.message.date')}</dt>
            <dd>{fmt.date(booking.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</dd>
          </div>
          <div>
            <dt>{t('success.message.guests')}</dt>
            <dd>{guests.join(', ')}</dd>
          </div>
          <div>
            <dt>{t('success.message.type')}</dt>
            <dd>{t(`booking.types.${booking.type}`)}</dd>
          </div>
          <div>
            <dt>{t('success.message.total')}</dt>
            <dd className={styles.total}>{fmt.price(booking.price.total)}</dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <Button href={whatsappLink(message)} target="_blank" rel="noreferrer" size="lg">
            <WhatsAppIcon />
            {t('success.sendWhatsapp')}
          </Button>
          <Button href={telegramLink()} target="_blank" rel="noreferrer" variant="secondary" size="lg" onClick={openTelegram}>
            <TelegramIcon />
            {t('success.sendTelegram')}
          </Button>
          <Button to="/my-bookings" variant="ghost">
            <ListChecks aria-hidden="true" />
            {t('nav.myBookings')}
          </Button>
        </div>
        <p className={styles.hint}>{t('success.telegramHint')}</p>
        <Ornament className={styles.ornament} />
      </div>
    </div>
  );
}
