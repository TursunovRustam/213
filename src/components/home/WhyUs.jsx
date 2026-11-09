import { HandCoins, House, Route, UsersRound } from 'lucide-react';
import { useT } from '../../i18n/useT';
import Reveal from '../ui/Reveal';
import styles from './WhyUs.module.css';

// Иконки для четырёх пунктов «Почему с нами». Тексты — в i18n (home.why.items)
const ITEMS = [
  { key: 'local', icon: House },
  { key: 'small', icon: UsersRound },
  { key: 'flexible', icon: Route },
  { key: 'honest', icon: HandCoins },
];

export default function WhyUs() {
  const { t } = useT();
  return (
    <section className="section" aria-labelledby="why-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.intro}>
          <h2 id="why-title" className={styles.title}>
            {t('home.why.title')}
          </h2>
          <p className={styles.lead}>{t('home.why.lead')}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul role="list" className={styles.list}>
            {ITEMS.map(({ key, icon: Icon }) => (
              <li key={key} className={styles.item}>
                <span className={styles.icon}>
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <h3 className={styles.itemTitle}>{t(`home.why.items.${key}.title`)}</h3>
                  <p className={styles.itemText}>{t(`home.why.items.${key}.text`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
