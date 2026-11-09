import { ArrowRight } from 'lucide-react';
import { site } from '../../config/site';
import { useT } from '../../i18n/useT';
import ArchFrame from '../ui/ArchFrame';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import SmartImage from '../ui/SmartImage';
import styles from './GuideTeaser.module.css';

// Тёмная секция «О гиде» с портретом в арке
export default function GuideTeaser() {
  const { t, tp, tr, fmt } = useT();
  const name = tr(site.guide.name);
  const languages = site.guide.languages.map((code) => fmt.language(code)).join(', ');

  return (
    <section className={`section ${styles.section} on-dark`} aria-labelledby="guide-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.portrait}>
          <ArchFrame ratio={3 / 4} outline>
            <SmartImage
              src={site.guide.portrait}
              alt={t('about.portraitAlt', { name })}
              label={name}
              scene="city"
              tone="tile"
            />
          </ArchFrame>
        </Reveal>

        <Reveal className={styles.text} delay={0.1}>
          <h2 id="guide-title" className={styles.title}>
            {t('home.guide.title', { name: tr(site.guide.firstName) })}
          </h2>
          <p className={styles.quote}>{t('home.guide.quote')}</p>
          <p className={styles.bio}>{t('home.guide.bio', { name })}</p>

          <dl className={styles.facts}>
            <div>
              <dt>{t('home.guide.experience')}</dt>
              <dd>{tp('plural.yearsPlus', site.guide.experienceYears)}</dd>
            </div>
            <div>
              <dt>{t('home.guide.languages')}</dt>
              <dd>{languages}</dd>
            </div>
            <div>
              <dt>{t('home.guide.home')}</dt>
              <dd>{tr(site.guide.hometown)}</dd>
            </div>
          </dl>

          <Button to="/about" variant="outline-light">
            {t('home.guide.more')}
            <ArrowRight aria-hidden="true" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
