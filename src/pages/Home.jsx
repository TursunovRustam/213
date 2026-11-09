import { useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import { useT } from '../i18n/useT';
import { usePageMeta } from '../hooks/usePageMeta';
import { selectPopularTours, selectToursStatus } from '../store/slices/toursSlice';
import Destinations from '../components/home/Destinations';
import FaqSection from '../components/home/FaqSection';
import FinalCta from '../components/home/FinalCta';
import GuideTeaser from '../components/home/GuideTeaser';
import Hero from '../components/home/Hero';
import OutsideBukhara from '../components/home/OutsideBukhara';
import ReviewsCarousel from '../components/home/ReviewsCarousel';
import TrustBar from '../components/home/TrustBar';
import WhyUs from '../components/home/WhyUs';
import TourGrid from '../components/tours/TourGrid';
import Button from '../components/ui/Button';
import Ornament from '../components/ui/Ornament';
import Reveal from '../components/ui/Reveal';
import SectionHeader from '../components/ui/SectionHeader';

export default function Home() {
  const { t } = useT();
  const popular = useSelector(selectPopularTours);
  const status = useSelector(selectToursStatus);
  usePageMeta(t('meta.home.title'), t('meta.home.description'));

  return (
    <>
      <Hero />
      <TrustBar />

      <section className="section" aria-labelledby="popular-title">
        <div className="container">
          <SectionHeader
            id="popular-title"
            title={t('home.popular.title')}
            lead={t('home.popular.lead')}
            action={
              <Button to="/tours" variant="secondary">
                {t('home.popular.all')}
                <ArrowRight aria-hidden="true" />
              </Button>
            }
          />
          <Reveal>
            <TourGrid tours={popular} loading={status !== 'succeeded'} />
          </Reveal>
        </div>
      </section>

      <Destinations />
      <GuideTeaser />
      <WhyUs />
      <OutsideBukhara />
      <ReviewsCarousel />
      <Ornament />
      <FaqSection />
      <FinalCta />
    </>
  );
}
