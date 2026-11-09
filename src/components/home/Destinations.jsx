import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowUpRight } from 'lucide-react';
import { site } from '../../config/site';
import { useT } from '../../i18n/useT';
import { selectTourCountByRegion } from '../../store/slices/toursSlice';
import ArchFrame from '../ui/ArchFrame';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import styles from './Destinations.module.css';

// «Направления»: карточки-арки. Регионы без активных туров скрываются.
export default function Destinations() {
  const { t, tp, tr } = useT();
  const countByRegion = useSelector(selectTourCountByRegion);
  const items = site.destinations.filter((item) => countByRegion[item.region]);

  if (!items.length) return null;

  return (
    <section className={`section ${styles.section}`} aria-labelledby="destinations-title">
      <div className="container">
        <SectionHeader id="destinations-title" title={t('home.destinations.title')} lead={t('home.destinations.lead')} />
      </div>
      <Reveal>
        <ul role="list" className={styles.list} style={{ '--count': items.length }}>
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/tours?region=${item.region}`} className={styles.card}>
                <ArchFrame ratio={3 / 4.2} className={styles.arch}>
                  <SmartImage
                    src={item.image}
                    alt=""
                    scene={item.scene}
                    tone={item.tone}
                    showLabel={false}
                    className={styles.image}
                  />
                </ArchFrame>
                <span className={styles.text}>
                  <span className={styles.name}>{tr(item.title)}</span>
                  <span className={styles.count}>
                    {tp('plural.tours', countByRegion[item.region])}
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
