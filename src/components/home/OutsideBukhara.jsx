import { useSelector } from 'react-redux';
import { useT } from '../../i18n/useT';
import { selectOutsideBukharaTours } from '../../store/slices/toursSlice';
import TourCard from '../tours/TourCard';
import Carousel from '../ui/Carousel';
import SectionHeader from '../ui/SectionHeader';
import styles from './OutsideBukhara.module.css';

// «За пределами Бухары»: карусель туров с outsideBukhara: true. Нет активных — секции нет.
export default function OutsideBukhara() {
  const { t } = useT();
  const tours = useSelector(selectOutsideBukharaTours);

  if (!tours.length) return null;

  return (
    <section className={`section ${styles.section}`} aria-labelledby="outside-title">
      <div className="container">
        <SectionHeader id="outside-title" title={t('home.outside.title')} lead={t('home.outside.lead')} />
      </div>
      <Carousel label={t('home.outside.title')} slideWidth="min(84vw, 360px)">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </Carousel>
    </section>
  );
}
