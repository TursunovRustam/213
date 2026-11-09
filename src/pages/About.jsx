import { Award, Clock, Languages, MapPin } from 'lucide-react';
import { site, whatsappLink } from '../config/site';
import { useT } from '../i18n/useT';
import { usePageMeta } from '../hooks/usePageMeta';
import ArchFrame from '../components/ui/ArchFrame';
import Button from '../components/ui/Button';
import { WhatsAppIcon } from '../components/ui/BrandIcons';
import Ornament from '../components/ui/Ornament';
import Reveal from '../components/ui/Reveal';
import SmartImage from '../components/ui/SmartImage';
import styles from './About.module.css';

// История гида. Тексты — в i18n (about.*), факты (стаж, языки, лицензия) — в config/site.js
export default function About() {
  const { t, tp, tr, fmt } = useT();
  const name = tr(site.guide.name);
  const languages = site.guide.languages.map((code) => fmt.language(code)).join(', ');

  usePageMeta(t('meta.about.title', { name }), t('meta.about.description', { name }));

  const facts = [
    { icon: MapPin, title: t('about.facts.home'), text: tr(site.guide.hometown) },
    { icon: Clock, title: t('about.facts.experience'), text: tp('plural.yearsPlus', site.guide.experienceYears) },
    { icon: Languages, title: t('about.facts.languages'), text: languages },
    { icon: Award, title: t('about.facts.license'), text: tr(site.guide.license) },
  ];

  return (
    <div className={styles.page}>
      <section className={`container ${styles.intro}`}>
        <Reveal className={styles.portrait}>
          <ArchFrame ratio={3 / 4} outline>
            <SmartImage src={site.guide.portrait} alt={t('about.portraitAlt', { name })} label={name} scene="city" tone="dusk" priority />
          </ArchFrame>
        </Reveal>
        <div className={styles.introText}>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.lead}>{t('about.lead')}</p>
          <ul role="list" className={styles.facts}>
            {facts.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Ornament />

      <section className={`container ${styles.story}`} aria-labelledby="story-title">
        <h2 id="story-title" className={styles.storyTitle}>
          {t('about.storyTitle')}
        </h2>
        <div className={styles.storyText}>
          <p>{t('about.story1')}</p>
          <p>{t('about.story2')}</p>
          <blockquote className={styles.quote}>
            <p>{t('home.guide.quote')}</p>
          </blockquote>
          <p>{t('about.story3')}</p>
          <p>{t('about.story4')}</p>
        </div>
      </section>

      <section className={`section ${styles.gallerySection}`} aria-labelledby="gallery-title">
        <div className="container">
          <h2 id="gallery-title" className={styles.galleryTitle}>
            {t('about.galleryTitle')}
          </h2>
          <ul role="list" className={styles.gallery}>
            {site.guide.gallery.map((photo, index) => (
              <li key={photo.src} className={styles.photo}>
                <Reveal delay={(index % 3) * 0.08}>
                  <SmartImage src={photo.src} alt={tr(photo.alt)} label={tr(photo.alt)} scene={index === 2 ? 'desert' : 'city'} className={styles.photoImage} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.cta}`}>
          <h2 className={styles.ctaTitle}>{t('about.ctaTitle')}</h2>
          <p className={styles.ctaText}>{t('about.ctaText')}</p>
          <div className={styles.ctaActions}>
            <Button to="/tours" size="lg">
              {t('about.ctaTours')}
            </Button>
            <Button href={whatsappLink(t('contact.whatsappGreeting'))} target="_blank" rel="noreferrer" variant="secondary" size="lg">
              <WhatsAppIcon />
              {t('about.ctaWrite')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
