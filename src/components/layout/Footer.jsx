import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { instagramLink, phoneLink, site, telegramLink, whatsappLink } from '../../config/site';
import { useT } from '../../i18n/useT';
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from '../ui/BrandIcons';
import Logo from './Logo';
import styles from './Footer.module.css';

const YEAR = new Date().getFullYear();

const REGION_LINKS = ['bukhara', 'desert', 'samarkand', 'khiva', 'tashkent'];

export default function Footer() {
  const { t, tr } = useT();
  return (
    <footer id="contacts" className={`${styles.footer} on-dark`}>
      <div className={styles.ikat} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.about}>{t('footer.about', { name: tr(site.guide.name) })}</p>
          <div className={styles.socials}>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={styles.social}>
              <WhatsAppIcon />
            </a>
            <a href={telegramLink()} target="_blank" rel="noreferrer" aria-label="Telegram" className={styles.social}>
              <TelegramIcon />
            </a>
            <a href={instagramLink()} target="_blank" rel="noreferrer" aria-label="Instagram" className={styles.social}>
              <InstagramIcon />
            </a>
          </div>
        </div>

        <nav aria-label={t('footer.toursTitle')}>
          <h2 className={styles.heading}>{t('footer.toursTitle')}</h2>
          <ul role="list" className={styles.list}>
            {REGION_LINKS.map((region) => (
              <li key={region}>
                <Link to={`/tours?region=${region}`}>{t(`regions.${region}`)}</Link>
              </li>
            ))}
            <li>
              <Link to="/tours">{t('footer.allTours')}</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t('footer.infoTitle')}>
          <h2 className={styles.heading}>{t('footer.infoTitle')}</h2>
          <ul role="list" className={styles.list}>
            <li>
              <Link to="/about">{t('nav.about')}</Link>
            </li>
            <li>
              <Link to="/#reviews">{t('nav.reviews')}</Link>
            </li>
            <li>
              <Link to="/#faq">{t('nav.faq')}</Link>
            </li>
            <li>
              <Link to="/favorites">{t('nav.favorites')}</Link>
            </li>
            <li>
              <Link to="/my-bookings">{t('nav.myBookings')}</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={styles.heading}>{t('footer.contactsTitle')}</h2>
          <ul role="list" className={styles.list}>
            <li>
              <a href={phoneLink()} className={styles.contact}>
                <Phone aria-hidden="true" />
                <span className="tabular">{site.contacts.phone}</span>
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className={styles.contact}>
                <WhatsAppIcon /> WhatsApp
              </a>
            </li>
            <li>
              <a href={telegramLink()} target="_blank" rel="noreferrer" className={styles.contact}>
                <TelegramIcon /> @{site.contacts.telegram}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contacts.email}`} className={styles.contact}>
                <Mail aria-hidden="true" /> {site.contacts.email}
              </a>
            </li>
            <li className={styles.contact}>
              <MapPin aria-hidden="true" /> {tr(site.contacts.city)}
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {YEAR} {site.brand}
        </p>
        <p>{t('footer.madeIn')}</p>
      </div>
    </footer>
  );
}
