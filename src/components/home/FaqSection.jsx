import { faq } from '../../data/faq';
import { whatsappLink } from '../../config/site';
import { useT } from '../../i18n/useT';
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import { WhatsAppIcon } from '../ui/BrandIcons';
import Reveal from '../ui/Reveal';
import styles from './FaqSection.module.css';

// Частые вопросы (якорь #faq). Вопросы — в data/faq.js
export default function FaqSection() {
  const { t, tr } = useT();
  const items = faq.map((item) => ({
    id: item.id,
    title: tr(item.question),
    content: <p>{tr(item.answer)}</p>,
  }));

  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.intro}>
          <h2 id="faq-title" className={styles.title}>
            {t('home.faq.title')}
          </h2>
          <p className={styles.lead}>{t('home.faq.lead')}</p>
          <Button href={whatsappLink(t('contact.whatsappGreeting'))} target="_blank" rel="noreferrer" variant="secondary">
            <WhatsAppIcon />
            {t('home.faq.ask')}
          </Button>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion items={items} defaultOpenId={items[0]?.id} />
        </Reveal>
      </div>
    </section>
  );
}
