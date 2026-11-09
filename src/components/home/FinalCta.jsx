import { ArrowRight } from 'lucide-react';
import { site, telegramLink, whatsappLink } from '../../config/site';
import { useT } from '../../i18n/useT';
import Button from '../ui/Button';
import { TelegramIcon, WhatsAppIcon } from '../ui/BrandIcons';
import Reveal from '../ui/Reveal';
import styles from './FinalCta.module.css';

// Финальный призыв: написать гиду в WhatsApp или Telegram
export default function FinalCta() {
  const { t, tr } = useT();
  return (
    <section className={`${styles.section} on-dark`} aria-labelledby="cta-title">
      <div className="container">
        <Reveal className={styles.card}>
          <svg className={styles.arch} viewBox="0 0 100 130" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 130V40Q0 12 50 0Q100 12 100 40V130" />
          </svg>
          <h2 id="cta-title" className={styles.title}>
            {t('home.cta.title')}
          </h2>
          <p className={styles.text}>{t('home.cta.text', { name: tr(site.guide.firstName) })}</p>
          <div className={styles.actions}>
            <Button href={whatsappLink(t('contact.whatsappGreeting'))} target="_blank" rel="noreferrer" variant="light" size="lg">
              <WhatsAppIcon />
              WhatsApp
            </Button>
            <Button href={telegramLink()} target="_blank" rel="noreferrer" variant="outline-light" size="lg">
              <TelegramIcon />
              Telegram
            </Button>
          </div>
          <Button to="/tours" variant="ghost" className={styles.link}>
            {t('home.cta.browse')}
            <ArrowRight aria-hidden="true" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
