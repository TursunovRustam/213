import { motion } from 'framer-motion';
import { site } from '../../config/site';
import { useT } from '../../i18n/useT';
import { cx } from '../../utils/cx';
import SmartImage from '../ui/SmartImage';
import HeroScene from './HeroScene';
import SearchPill from './SearchPill';
import styles from './Hero.module.css';

const ease = [0.16, 1, 0.3, 1];

const titleVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const wordVariants = {
  hidden: { opacity: 0, y: '0.5em' },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

// Первый экран: фото Бухары на закате, заголовок по словам и поиск
export default function Hero() {
  const { t, tr } = useT();
  const words = t('home.hero.title').split(' ');

  return (
    <section className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
      <SmartImage
        src={site.images.hero}
        alt={tr(site.images.heroAlt)}
        priority
        fallback={<HeroScene />}
        className={styles.background}
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <motion.h1 id="hero-title" className={styles.title} variants={titleVariants} initial="hidden" animate="show">
          {words.map((word, index) => (
            <span key={`${word}-${index}`}>
              <motion.span className={cx(styles.word, index === 0 && styles.accent)} variants={wordVariants}>
                {word}
              </motion.span>{' '}
            </span>
          ))}
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
        >
          {t('home.hero.subtitle', { name: tr(site.guide.name) })}
        </motion.p>

        <motion.div
          className={styles.search}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease }}
        >
          <SearchPill />
        </motion.div>
      </div>
    </section>
  );
}
