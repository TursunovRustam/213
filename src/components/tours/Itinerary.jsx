import { useT } from '../../i18n/useT';
import styles from './Itinerary.module.css';

// Программа тура вертикальным таймлайном. Для многодневных туров вместо времени — «День 1»
export default function Itinerary({ items }) {
  const { t, tr } = useT();
  return (
    <ol className={styles.timeline}>
      {items.map((item, index) => (
        <li key={`${item.time ?? item.day}-${index}`} className={styles.step}>
          <span className={styles.marker} aria-hidden="true" />
          <p className={styles.when}>{item.day ? t('tour.day', { n: item.day }) : item.time}</p>
          <h3 className={styles.title}>{tr(item.title)}</h3>
          <p className={styles.text}>{tr(item.text)}</p>
        </li>
      ))}
    </ol>
  );
}
