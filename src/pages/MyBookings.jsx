import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CalendarDays, CalendarX2, Users } from 'lucide-react';
import { site, whatsappLink } from '../config/site';
import { useT } from '../i18n/useT';
import { usePageMeta } from '../hooks/usePageMeta';
import { cancelBooking, selectBookings } from '../store/slices/bookingSlice';
import { buildBookingMessage } from '../utils/bookingMessage';
import { isPastDate } from '../utils/dates';
import { cx } from '../utils/cx';
import Button from '../components/ui/Button';
import { WhatsAppIcon } from '../components/ui/BrandIcons';
import PageHeader from '../components/ui/PageHeader';
import styles from './MyBookings.module.css';

// Брони гостя. Хранятся только в этом браузере (localStorage).
export default function MyBookings() {
  const i18n = useT();
  const { t, tp, tr, fmt } = i18n;
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookings);
  const [confirmCode, setConfirmCode] = useState(null);

  usePageMeta(t('meta.myBookings.title'), t('meta.myBookings.description'));

  const handleCancel = (booking) => {
    dispatch(cancelBooking(booking.code));
    setConfirmCode(null);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('myBookings.title')}
        lead={t('myBookings.lead')}
        breadcrumbs={[{ label: t('common.home'), to: '/' }, { label: t('myBookings.title') }]}
      />

      <div className={`container ${styles.content}`}>
        {bookings.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              <CalendarX2 />
            </span>
            <h2>{t('myBookings.emptyTitle')}</h2>
            <p>{t('myBookings.emptyText')}</p>
            <Button to="/tours">{t('favorites.browse')}</Button>
          </div>
        ) : (
          <ul role="list" className={styles.list}>
            {bookings.map((booking) => {
              const cancelled = booking.status === 'cancelled';
              const past = isPastDate(booking.date);
              const status = cancelled ? 'cancelled' : past ? 'past' : 'pending';
              const guests = [tp('plural.adults', booking.adults)];
              if (booking.children) guests.push(tp('plural.children', booking.children));

              return (
                <li key={booking.code} className={cx(styles.item, cancelled && styles.cancelled)}>
                  <div className={styles.top}>
                    <span className={styles.code}>{booking.code}</span>
                    <span className={cx(styles.status, styles[status])}>{t(`myBookings.status.${status}`)}</span>
                  </div>

                  <h2 className={styles.tourTitle}>
                    <Link to={`/tours/${booking.tourSlug}`}>{tr(booking.tourTitle)}</Link>
                  </h2>

                  <ul role="list" className={styles.meta}>
                    <li>
                      <CalendarDays aria-hidden="true" />
                      {fmt.date(booking.date, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                    </li>
                    <li>
                      <Users aria-hidden="true" />
                      {guests.join(', ')} · {t(`booking.types.${booking.type}`)}
                    </li>
                  </ul>

                  <div className={styles.bottom}>
                    <span className={styles.total}>{fmt.price(booking.price.total)}</span>

                    {!cancelled && !past && (
                      <div className={styles.actions}>
                        {confirmCode === booking.code ? (
                          <div className={styles.confirm} role="group" aria-label={t('myBookings.confirmTitle')}>
                            <span>{t('myBookings.confirmText', { hours: site.cancellation.hours })}</span>
                            <Button size="sm" onClick={() => handleCancel(booking)}>
                              {t('myBookings.confirmYes')}
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setConfirmCode(null)}>
                              {t('myBookings.confirmNo')}
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button href={whatsappLink(buildBookingMessage(booking, i18n))} target="_blank" rel="noreferrer" size="sm" variant="secondary">
                              <WhatsAppIcon />
                              {t('myBookings.send')}
                            </Button>
                            <Button size="sm" variant="ghost" className={styles.cancelButton} onClick={() => setConfirmCode(booking.code)}>
                              {t('myBookings.cancel')}
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
