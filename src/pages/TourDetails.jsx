import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  Bus,
  Check,
  CircleCheck,
  Clock,
  Info,
  Languages,
  MapPin,
  Navigation,
  Share2,
  Sparkles,
  UsersRound,
  Wallet,
  X,
} from 'lucide-react';
import { reviews as allReviews } from '../data/reviews';
import { site } from '../config/site';
import { useT } from '../i18n/useT';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePageMeta } from '../hooks/usePageMeta';
import { selectActiveTours, selectSimilarTours, selectTourBySlug, selectToursStatus } from '../store/slices/toursSlice';
import { sceneForTour } from '../utils/pricing';
import { cx } from '../utils/cx';
import BookingWidget from '../components/tours/BookingWidget';
import FavoriteButton from '../components/tours/FavoriteButton';
import Gallery from '../components/tours/Gallery';
import Itinerary from '../components/tours/Itinerary';
import ReviewsList from '../components/tours/ReviewsList';
import TourGrid from '../components/tours/TourGrid';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import PageLoader from '../components/ui/PageLoader';
import Price from '../components/ui/Price';
import Rating from '../components/ui/Rating';
import NotFound from './NotFound';
import styles from './TourDetails.module.css';

const LONG_DESCRIPTION = 520; // символов: длиннее — показываем «Показать больше»

export default function TourDetails() {
  const { slug } = useParams();
  const { t, tr, fmt, lang } = useT();
  const tour = useSelector((state) => selectTourBySlug(state, slug));
  const status = useSelector(selectToursStatus);
  const similar = useSelector((state) => selectSimilarTours(state, tour));
  const activeTours = useSelector(selectActiveTours);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  usePageMeta(tour ? tr(tour.title) : null, tour ? tr(tour.shortDescription) : null);

  if (status !== 'succeeded') return <PageLoader />;
  if (!tour) return <NotFound />;

  const title = tr(tour.title);
  const description = tr(tour.description);
  const isLong = description.length > LONG_DESCRIPTION;
  const tourReviews = allReviews.filter((review) => review.tourId === tour.id);
  const otherReviews = tourReviews.length ? [] : allReviews.slice(0, 4);
  const languages = tour.languages.map((code) => fmt.language(code)).join(', ');

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // гость закрыл окно «Поделиться» — ничего не делаем
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt(t('tour.copyPrompt'), url);
    }
  };

  const facts = [
    tour.freeCancellation && {
      icon: CircleCheck,
      title: t('tour.facts.freeCancellation'),
      text: t('tour.facts.freeCancellationText', { hours: site.cancellation.hours }),
    },
    { icon: Wallet, title: t('tour.facts.payLater'), text: t('tour.facts.payLaterText') },
    { icon: Clock, title: t('tour.facts.duration'), text: fmt.duration(tour.duration) },
    { icon: Languages, title: t('tour.facts.languages'), text: languages },
    tour.transfer
      ? { icon: Bus, title: t('tour.facts.transfer'), text: t('tour.facts.transferText') }
      : { icon: MapPin, title: t('tour.facts.meetingPoint'), text: tr(tour.startsFrom) },
    { icon: UsersRound, title: t('tour.facts.groupSize'), text: t('tour.facts.groupSizeText', { count: tour.maxGroupSize }) },
  ].filter(Boolean);

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(tour.meetingPoint.mapQuery)}&hl=${lang}&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.meetingPoint.mapQuery)}`;

  return (
    <div className={styles.page}>
      <div className="container">
        <nav aria-label={t('common.breadcrumbs')} className={styles.crumbsNav}>
          <ol className={styles.crumbs}>
            <li>
              <Link to="/">{t('common.home')}</Link>
            </li>
            <li>
              <Link to="/tours">{t('nav.tours')}</Link>
            </li>
            <li>
              <Link to={`/tours?region=${tour.region}`}>{t(`regions.${tour.region}`)}</Link>
            </li>
            <li>
              <span aria-current="page">{title}</span>
            </li>
          </ol>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.meta}>
            <a href="#tour-reviews" className={styles.ratingLink}>
              <Rating value={tour.rating} count={tour.reviewsCount} />
            </a>
            <span className={styles.metaItem}>
              <MapPin aria-hidden="true" />
              {t('tour.startsFrom', { place: tr(tour.startsFrom) })}
            </span>
            <div className={styles.actions}>
              <button type="button" className={styles.share} onClick={handleShare}>
                <Share2 aria-hidden="true" />
                {copied ? t('tour.linkCopied') : t('tour.share')}
              </button>
              <FavoriteButton tourId={tour.id} tourTitle={title} variant="inline" />
            </div>
          </div>
        </header>

        <Gallery images={tour.images} scene={sceneForTour(tour)} />

        <div className={styles.layout}>
          <div className={styles.main}>
            <p className={styles.short}>{tr(tour.shortDescription)}</p>

            <ul role="list" className={styles.facts}>
              {facts.map(({ icon: Icon, title: factTitle, text }) => (
                <li key={factTitle} className={styles.fact}>
                  <Icon aria-hidden="true" />
                  <span>
                    <strong>{factTitle}</strong>
                    <span>{text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <section className={styles.block} aria-labelledby="highlights-title">
              <h2 id="highlights-title" className={styles.blockTitle}>
                {t('tour.highlights')}
              </h2>
              <ul role="list" className={styles.highlights}>
                {tour.highlights.map((item) => (
                  <li key={item.en}>
                    <Sparkles aria-hidden="true" />
                    {tr(item)}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.block} aria-labelledby="description-title">
              <h2 id="description-title" className={styles.blockTitle}>
                {t('tour.description')}
              </h2>
              <div id="tour-description" className={cx(styles.description, isLong && !expanded && styles.collapsed)}>
                {description.split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
              {isLong && (
                <button
                  type="button"
                  className={styles.more}
                  aria-expanded={expanded}
                  aria-controls="tour-description"
                  onClick={() => setExpanded((value) => !value)}
                >
                  {expanded ? t('tour.showLess') : t('tour.showMore')}
                </button>
              )}
            </section>

            <section className={styles.block} aria-labelledby="itinerary-title">
              <h2 id="itinerary-title" className={styles.blockTitle}>
                {t('tour.itinerary')}
              </h2>
              <Itinerary items={tour.itinerary} />
            </section>

            <section className={styles.block} aria-labelledby="included-title">
              <h2 id="included-title" className={styles.blockTitle}>
                {t('tour.includedTitle')}
              </h2>
              <div className={styles.included}>
                <ul role="list" aria-label={t('tour.included')}>
                  {tour.included.map((item) => (
                    <li key={item.en}>
                      <Check aria-hidden="true" className={styles.yes} />
                      {tr(item)}
                    </li>
                  ))}
                </ul>
                <ul role="list" aria-label={t('tour.notIncluded')}>
                  {tour.notIncluded.map((item) => (
                    <li key={item.en}>
                      <X aria-hidden="true" className={styles.no} />
                      {tr(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className={styles.block} aria-labelledby="meeting-title">
              <h2 id="meeting-title" className={styles.blockTitle}>
                {tour.transfer ? t('tour.pickup') : t('tour.meetingPoint')}
              </h2>
              <p className={styles.meetingText}>
                <MapPin aria-hidden="true" />
                {tr(tour.meetingPoint.text)}
              </p>
              <div className={styles.map}>
                <iframe
                  title={t('tour.mapTitle', { place: tour.meetingPoint.mapQuery })}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a href={mapLink} target="_blank" rel="noreferrer" className={styles.mapLink}>
                <Navigation aria-hidden="true" />
                {t('tour.openMap')}
              </a>
            </section>

            {tour.importantInfo?.length > 0 && (
              <section className={styles.block} aria-labelledby="info-title">
                <h2 id="info-title" className={styles.blockTitle}>
                  {t('tour.importantInfo')}
                </h2>
                <ul role="list" className={styles.info}>
                  {tour.importantInfo.map((item) => (
                    <li key={item.en}>
                      <Info aria-hidden="true" />
                      {tr(item)}
                    </li>
                  ))}
                  <li>
                    <Info aria-hidden="true" />
                    {tr(site.cancellation.text)}
                  </li>
                </ul>
              </section>
            )}

            <section id="tour-reviews" className={styles.block} aria-labelledby="reviews-title">
              <div className={styles.reviewsHead}>
                <h2 id="reviews-title" className={styles.blockTitle}>
                  {tourReviews.length ? t('tour.reviews') : t('tour.otherReviews')}
                </h2>
                <Rating value={tour.rating} count={tour.reviewsCount} />
              </div>
              <ReviewsList reviews={tourReviews.length ? tourReviews : otherReviews} tours={tourReviews.length ? [] : activeTours} />
            </section>
          </div>

          {isDesktop && (
            <aside className={styles.aside} aria-label={t('booking.widgetTitle')}>
              <div className={styles.widgetCard}>
                <BookingWidget tour={tour} />
              </div>
            </aside>
          )}
        </div>

        {similar.length > 0 && (
          <section className={styles.similar} aria-labelledby="similar-title">
            <h2 id="similar-title" className={styles.similarTitle}>
              {t('tour.similar')}
            </h2>
            <TourGrid tours={similar} />
          </section>
        )}
      </div>

      {!isDesktop && (
        <>
          <div className={styles.mobileBar}>
            <Price amount={tour.price} oldAmount={tour.oldPrice} size="sm" />
            <Button onClick={() => setSheetOpen(true)}>{t('booking.checkAvailability')}</Button>
          </div>
          <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={t('booking.widgetTitle')}>
            <BookingWidget tour={tour} onBook={() => setSheetOpen(false)} />
          </BottomSheet>
        </>
      )}
    </div>
  );
}
