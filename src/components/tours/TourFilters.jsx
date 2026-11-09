import { useId } from 'react';
import { RotateCcw } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { cx } from '../../utils/cx';
import styles from './TourFilters.module.css';

const REGIONS = ['all', 'bukhara', 'desert', 'samarkand', 'khiva', 'tashkent', 'multi'];
const DURATION_TYPES = ['all', 'short', 'full-day', 'multi-day'];
const PRICE_STEP = 5;

/**
 * Фильтры каталога. Сами фильтры хранятся в Redux и в адресной строке,
 * а этот компонент только показывает их и сообщает об изменениях через onChange(patch).
 */
export default function TourFilters({ filters, regionCounts, bounds, onChange, onReset, hasActiveFilters }) {
  const { t, tp } = useT();
  const id = useId();
  const regions =REGIONS.filter((region) => region === 'all' || regionCounts[region] || filters.region === region);

  return (
    <div className={styles.filters}>
      <fieldset className={styles.group}>
        <legend className={styles.legend}>{t('filters.region')}</legend>
        <div className={styles.chips}>
          {regions.map((region) => (
            <label key={region} className={styles.chip}>
              <input
                type="radio"
                name={`${id}-region`}
                value={region}
                checked={filters.region === region}
                onChange={() => onChange({ region })}
              />
              <span>
                {region === 'all' ? t('filters.allRegions') : t(`regions.${region}`)}
                {region !== 'all' && <small className={styles.count}>{regionCounts[region] ?? 0}</small>}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>{t('filters.duration')}</legend>
        <div className={styles.chips}>
          {DURATION_TYPES.map((type) => (
            <label key={type} className={styles.chip}>
              <input
                type="radio"
                name={`${id}-duration`}
                value={type}
                checked={filters.durationType === type}
                onChange={() => onChange({ durationType: type })}
              />
              <span>{t(`filters.durationTypes.${type}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {bounds.max > bounds.min && (
        <PriceRange
          min={bounds.min}
          max={bounds.max}
          valueMin={filters.priceMin}
          valueMax={filters.priceMax}
          onChange={onChange}
        />
      )}

      <label className={styles.switch}>
        <input
          type="checkbox"
          role="switch"
          checked={filters.transferOnly}
          onChange={(event) => onChange({ transferOnly: event.target.checked })}
        />
        <span className={styles.track} aria-hidden="true" />
        <span>{t('filters.transferOnly')}</span>
      </label>

      {filters.guests > 0 && (
        <p className={styles.note}>
          {t('filters.guestsNote', { guests: tp('plural.guests', filters.guests) })}{' '}
          <button type="button" className={styles.linkButton} onClick={() => onChange({ guests: 0 })}>
            {t('filters.clear')}
          </button>
        </p>
      )}

      {hasActiveFilters && (
        <button type="button" className={styles.reset} onClick={onReset}>
          <RotateCcw aria-hidden="true" />
          {t('filters.reset')}
        </button>
      )}
    </div>
  );
}

// Двойной ползунок цены «от — до»
function PriceRange({ min, max, valueMin, valueMax, onChange }) {
  const { t, fmt } = useT();
  const low = valueMin ?? min;
  const high = valueMax ?? max;
  const percent = (value) => `${((value - min) / (max - min)) * 100}%`;

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{t('filters.price')}</legend>
      <p className={styles.priceValues} aria-live="polite">
        {fmt.price(low)} — {fmt.price(high)}
      </p>
      <div className={styles.range} style={{ '--low': percent(low), '--high': percent(high) }}>
        <input
          type="range"
          min={min}
          max={max}
          step={PRICE_STEP}
          value={low}
          aria-label={t('filters.priceMin')}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), high - PRICE_STEP);
            onChange({ priceMin: value <= min ? null : value });
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={PRICE_STEP}
          value={high}
          aria-label={t('filters.priceMax')}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), low + PRICE_STEP);
            onChange({ priceMax: value >= max ? null : value });
          }}
        />
      </div>
      <div className={cx(styles.rangeLabels)}>
        <span>{fmt.price(min)}</span>
        <span>{fmt.price(max)}</span>
      </div>
    </fieldset>
  );
}
