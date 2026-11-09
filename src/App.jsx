import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useT } from './i18n/useT';
import { fetchTours } from './store/slices/toursSlice';
import { selectLang } from './store/slices/settingsSlice';
import FloatingContact from './components/layout/FloatingContact';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import ScrollManager from './components/layout/ScrollManager';
import About from './pages/About';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';
import TourDetails from './pages/TourDetails';
import Tours from './pages/Tours';

// После того как старая страница плавно ушла — прокручиваем новую наверх (если нет якоря)
const scrollToTop = () => {
  if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
};

export default function App() {
  const dispatch = useDispatch();
  const lang = useSelector(selectLang);
  const location = useLocation();
  const { t } = useT();

  // Загрузка туров (сейчас из data/tours.js, позже — из API)
  useEffect(() => {
    dispatch(fetchTours());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const isHome = location.pathname === '/';

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        {t('common.skipToContent')}
      </a>
      <ScrollManager />
      <Header />

      <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
        <motion.main
          id="main"
          key={location.pathname}
          className={isHome ? undefined : 'page-offset'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:slug" element={<TourDetails />} />
            <Route path="/booking/success/:code" element={<BookingSuccess />} />
            <Route path="/booking/:slug" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <Footer />
      <FloatingContact />
    </MotionConfig>
  );
}
