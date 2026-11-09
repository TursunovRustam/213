import { useSelector } from 'react-redux';
import { reviews } from '../../data/reviews';
import { useT } from '../../i18n/useT';
import { selectActiveTours, selectTrustStats } from '../../store/slices/toursSlice';
import { ReviewCard } from '../tours/ReviewsList';
import Carousel from '../ui/Carousel';
import Rating from '../ui/Rating';
import SectionHeader from '../ui/SectionHeader';

// Карусель отзывов на главной (якорь #reviews)
export default function ReviewsCarousel() {
  const { t } = useT();
  const tours = useSelector(selectActiveTours);
  const { rating, reviews: count } = useSelector(selectTrustStats);

  return (
    <section id="reviews" className="section" aria-labelledby="reviews-title">
      <div className="container">
        <SectionHeader
          id="reviews-title"
          title={t('home.reviews.title')}
          lead={t('home.reviews.lead')}
          action={<Rating value={rating} count={count} />}
        />
      </div>
      <Carousel label={t('home.reviews.title')} slideWidth="min(86vw, 400px)">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} tour={tours.find((tour) => tour.id === review.tourId)} clamp />
        ))}
      </Carousel>
    </section>
  );
}
