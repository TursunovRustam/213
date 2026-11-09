import { useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CircleCheck, Wallet } from 'lucide-react';
import { site } from '../../config/site';
import { useT } from '../../i18n/useT';
import { emptyDraft, selectDraft, setDraft } from '../../store/slices/bookingSlice';
import { selectFilters } from '../../store/slices/toursSlice';
import { isPastDate, todayISO } from '../../utils/dates';
import { calcPrice } from '../../utils/pricing';
import { cx } from '../../utils/cx';
import Button from '../ui/Button';
import Counter from '../ui/Counter';
import Price from '../ui/Price';
import styles from './BookingWidget.module.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Виджет бронирования: дата, гости, групповой/индивидуальный, живой расчёт суммы.
// Выбор хранится в Redux (bookingSlice.draft), поэтому десктопный виджет и мобильная шторка синхронны.
export default function BookingWidget({ tour, onBook, className }) {
  const { t, tp, fmt } = useT();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedDraft = useSelector(selectDraft);
  const filters = useSelector(selectFilters);
  const dateId = useId();
  const [dateError, setDateError] = useState(false);

  // Если черновик относится к другому туру — начинаем с даты и гостей из поиска на главной
  const draft =
    storedDraft.slug === tour.slug
      ? storedDraft
      : {
          ...emptyDraft,
          slug: tour.slug,
          date: isPastDate(filters.date) ? '' : filters.date,
          adults: clamp(filters.guests || emptyDraft.adults, 1, tour.maxGroupSize),
        };

  const update = (patch) => dispatch(setDraft({ ...draft, ...patch }));
  const price = calcPrice(tour, draft);
  const hasPrivate = tour.privateSurcharge != null;

  const handleBook = () => {
    if (!draft.date || isPastDate(draft.date)) {
      setDateError(true);
      document.getElementById(dateId)?.focus();
      return;
    }
    dispatch(setDraft(draft));
    onBook?.();
    navigate(`/booking/${tour.slug}`);
  };

  return (
    <div className={cx(styles.widget, className)}>
      <Price amount={tour.price} oldAmount={tour.oldPrice} size="lg" />

      <div className="field">
        <label htmlFor={dateId} className="field-label">
          {t('booking.date')}
        </label>
        <div className={styles.dateWrap}>
          <CalendarDays aria-hidden="true" className={styles.dateIcon} />
          <input
            id={dateId}
            type="date"
            className={cx('input', styles.date)}
            min={todayISO()}
            value={draft.date}
            aria-invalid={dateError || undefined}
            aria-describedby={dateError ? `${dateId}-error` : undefined}
            onChange={(event) => {
              setDateError(false);
              update({ date: event.target.value });
            }}
          />
        </div>
        {dateError && (
          <p id={`${dateId}-error`} className="field-error">
            {t('booking.errors.date')}
          </p>
        )}
      </div>

      <div className={styles.counters}>
        <Counter
          id={`${dateId}-adults`}
          label={t('booking.adults')}
          hint={t('booking.adultsHint', { age: site.childAge.to + 1 })}
          value={draft.adults}
          min={1}
          max={tour.maxGroupSize - draft.children}
          onChange={(adults) => update({ adults })}
        />
        <Counter
          id={`${dateId}-children`}
          label={t('booking.children')}
          hint={t('booking.childrenHint', { from: site.childAge.from, to: site.childAge.to })}
          value={draft.children}
          min={0}
          max={tour.maxGroupSize - draft.adults}
          onChange={(children) => update({ children })}
        />
        <p className={styles.small}>
          {t('booking.infantsFree', { age: site.childAge.from })} · {t('booking.maxGroup', { count: tour.maxGroupSize })}
        </p>
      </div>

      {hasPrivate && (
        <fieldset className={styles.typeGroup}>
          <legend className="field-label">{t('booking.tourType')}</legend>
          <div className={styles.segmented}>
            {['group', 'private'].map((type) => (
              <label key={type} className={styles.segment}>
                <input
                  type="radio"
                  name={`${dateId}-type`}
                  value={type}
                  checked={draft.type === type}
                  onChange={() => update({ type })}
                />
                <span>
                  <strong>{t(`booking.types.${type}`)}</strong>
                  <small>
                    {type === 'private'
                      ? t('booking.privateNote', { price: fmt.price(tour.privateSurcharge) })
                      : t('booking.groupNote', { count: tour.maxGroupSize })}
                  </small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <dl className={styles.breakdown} aria-live="polite">
        <div>
          <dt>
            {tp('plural.adults', draft.adults)} × {fmt.price(tour.price)}
          </dt>
          <dd>{fmt.price(price.adultsTotal)}</dd>
        </div>
        {draft.children > 0 && (
          <div>
            <dt>
              {tp('plural.children', draft.children)} × {fmt.price(tour.childPrice ?? tour.price)}
            </dt>
            <dd>{fmt.price(price.childrenTotal)}</dd>
          </div>
        )}
        {price.privateFee > 0 && (
          <div>
            <dt>{t('booking.privateFee')}</dt>
            <dd>+{fmt.price(price.privateFee)}</dd>
          </div>
        )}
        <div className={styles.total}>
          <dt>{t('booking.total')}</dt>
          <dd>{fmt.price(price.total)}</dd>
        </div>
      </dl>

      <Button size="lg" block onClick={handleBook}>
        {t('booking.bookNow')}
      </Button>

      <ul role="list" className={styles.notes}>
        {tour.freeCancellation && (
          <li>
            <CircleCheck aria-hidden="true" />
            <span>
              <strong>{t('tour.facts.freeCancellation')}</strong> {t('tour.facts.freeCancellationText', { hours: site.cancellation.hours })}
            </span>
          </li>
        )}
        <li>
          <Wallet aria-hidden="true" />
          <span>
            <strong>{t('tour.facts.payLater')}</strong> {t('tour.facts.payLaterText')}
          </span>
        </li>
      </ul>
    </div>
  );
}
