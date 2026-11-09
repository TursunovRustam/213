import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CalendarDays, MapPin, Search, Users } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { defaultFilters, selectTourCountByRegion } from '../../store/slices/toursSlice';
import { todayISO } from '../../utils/dates';
import { buildTourQuery } from '../../utils/tourQuery';
import Button from '../ui/Button';
import styles from './SearchPill.module.css';

const REGION_ORDER = ['bukhara', 'desert', 'samarkand', 'khiva', 'tashkent', 'multi'];
const GUEST_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

// Поисковая «таблетка» на главной: Куда, Когда, Гости → /tours?region=…&date=…&guests=…
export default function SearchPill() {
  const { t, tp } = useT();
  const navigate = useNavigate();
  const countByRegion = useSelector(selectTourCountByRegion);
  const id = useId();
  const [region, setRegion] = useState('all');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(2);

  const regions = REGION_ORDER.filter((code) => countByRegion[code]);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate({ pathname: '/tours', search: buildTourQuery({ ...defaultFilters, region, date, guests }) });
  };

  return (
    <form className={styles.pill} onSubmit={handleSubmit} role="search" aria-label={t('search.label')}>
      <div className={styles.field}>
        <label htmlFor={`${id}-region`} className={styles.label}>
          <MapPin aria-hidden="true" />
          {t('search.where')}
        </label>
        <select id={`${id}-region`} className={styles.control} value={region} onChange={(event) => setRegion(event.target.value)}>
          <option value="all">{t('search.anywhere')}</option>
          {regions.map((code) => (
            <option key={code} value={code}>
              {t(`regions.${code}`)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-date`} className={styles.label}>
          <CalendarDays aria-hidden="true" />
          {t('search.when')}
        </label>
        <input
          id={`${id}-date`}
          type="date"
          className={styles.control}
          min={todayISO()}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-guests`} className={styles.label}>
          <Users aria-hidden="true" />
          {t('search.guests')}
        </label>
        <select
          id={`${id}-guests`}
          className={styles.control}
          value={guests}
          onChange={(event) => setGuests(Number(event.target.value))}
        >
          {GUEST_OPTIONS.map((count) => (
            <option key={count} value={count}>
              {tp('plural.guests', count)}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" size="lg" className={styles.submit}>
        <Search aria-hidden="true" />
        {t('search.find')}
      </Button>
    </form>
  );
}
