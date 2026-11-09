import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, CircleCheck, Clock, Lock, Users, Wallet } from 'lucide-react';
import { countryCodes } from '../data/countries';
import { site } from '../config/site';
import { useT } from '../i18n/useT';
import { usePageMeta } from '../hooks/usePageMeta';
import { selectDraft, selectSubmitStatus, submitBooking } from '../store/slices/bookingSlice';
import { selectTourBySlug, selectToursStatus } from '../store/slices/toursSlice';
import { isPastDate } from '../utils/dates';
import { calcPrice, sceneForTour } from '../utils/pricing';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import PageLoader from '../components/ui/PageLoader';
import SmartImage from '../components/ui/SmartImage';
import NotFound from './NotFound';
import styles from './Booking.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Простая проверка формы. Возвращает { поле: ключ ошибки из i18n }
function validate(values, needsHotel) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'booking.errors.name';
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'booking.errors.email';
  if (values.phone.replace(/\D/g, '').length < 7) errors.phone = 'booking.errors.phone';
  if (!values.country) errors.country = 'booking.errors.country';
  if (needsHotel && values.hotel.trim().length < 3) errors.hotel = 'booking.errors.hotel';
  if (!values.consent) errors.consent = 'booking.errors.consent';
  return errors;
}

// Порядок полей для фокуса на первой ошибке
const FIELD_ORDER = ['name', 'email', 'phone', 'country', 'hotel', 'consent'];

export default function Booking() {
  const { slug } = useParams();
  const { t, tp, tr, fmt, lang, locale } = useT();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tour = useSelector((state) => selectTourBySlug(state, slug));
  const toursStatus = useSelector(selectToursStatus);
  const draft = useSelector(selectDraft);
  const submitStatus = useSelector(selectSubmitStatus);

  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    hotel: '',
    language: lang,
    comment: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});

  const countries = useMemo(() => {
    const names = new Intl.DisplayNames([locale], { type: 'region' });
    return countryCodes
      .map((code) => ({ code, name: names.of(code) ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  usePageMeta(t('meta.booking.title'), t('meta.booking.description'));

  if (toursStatus !== 'succeeded') return <PageLoader />;
  if (!tour) return <NotFound />;

  const title = tr(tour.title);
  const hasDraft = draft.slug === tour.slug && draft.date && !isPastDate(draft.date);
  const tourLanguage = tour.languages.includes(values.language) ? values.language : tour.languages[0];

  if (!hasDraft) {
    return (
      <div className={styles.page}>
        <PageHeader title={t('booking.title')} />
        <div className={`container ${styles.missing}`}>
          <h2>{t('booking.noDraftTitle')}</h2>
          <p>{t('booking.noDraftText', { tour: title })}</p>
          <Button to={`/tours/${tour.slug}`}>{t('booking.chooseDate')}</Button>
        </div>
      </div>
    );
  }

  const price = calcPrice(tour, draft);
  const cover = tour.images[0];

  const setField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const fieldProps = (field) => ({
    id: `booking-${field}`,
    name: field,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `booking-${field}-error` : undefined,
  });

  const errorText = (field) =>
    errors[field] ? (
      <p id={`booking-${field}-error`} className="field-error">
        {t(errors[field])}
      </p>
    ) : null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values, tour.transfer);
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`booking-${firstInvalid}`)?.focus();
      return;
    }

    const customer = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      country: values.country,
      hotel: tour.transfer ? values.hotel.trim() : '',
      language: tourLanguage,
      comment: values.comment.trim(),
    };

    try {
      const booking = await dispatch(submitBooking({ tour, draft, customer, lang })).unwrap();
      navigate(`/booking/success/${booking.code}`);
    } catch {
      setErrors({ form: 'booking.errors.submit' });
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('booking.title')}
        lead={t('booking.lead')}
        breadcrumbs={[
          { label: t('common.home'), to: '/' },
          { label: title, to: `/tours/${tour.slug}` },
          { label: t('booking.title') },
        ]}
      />

      <div className={`container ${styles.layout}`}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>{t('booking.contactTitle')}</legend>

            <div className="field">
              <label htmlFor="booking-name" className="field-label">
                {t('booking.fields.name')}
              </label>
              <input {...fieldProps('name')} className="input" autoComplete="name" value={values.name} onChange={setField('name')} />
              {errorText('name')}
            </div>

            <div className={styles.row}>
              <div className="field">
                <label htmlFor="booking-email" className="field-label">
                  {t('booking.fields.email')}
                </label>
                <input
                  {...fieldProps('email')}
                  type="email"
                  className="input"
                  autoComplete="email"
                  inputMode="email"
                  value={values.email}
                  onChange={setField('email')}
                />
                {errorText('email')}
              </div>
              <div className="field">
                <label htmlFor="booking-phone" className="field-label">
                  {t('booking.fields.phone')}
                </label>
                <input
                  {...fieldProps('phone')}
                  type="tel"
                  className="input"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={t('booking.fields.phonePlaceholder')}
                  value={values.phone}
                  onChange={setField('phone')}
                />
                {errorText('phone')}
              </div>
            </div>

            <div className={styles.row}>
              <div className="field">
                <label htmlFor="booking-country" className="field-label">
                  {t('booking.fields.country')}
                </label>
                <select {...fieldProps('country')} className="input" autoComplete="country" value={values.country} onChange={setField('country')}>
                  <option value="">{t('booking.fields.countryPlaceholder')}</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errorText('country')}
              </div>
              <div className="field">
                <label htmlFor="booking-language" className="field-label">
                  {t('booking.fields.language')}
                </label>
                <select id="booking-language" className="input" value={tourLanguage} onChange={setField('language')}>
                  {tour.languages.map((code) => (
                    <option key={code} value={code}>
                      {fmt.language(code)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>{t('booking.detailsTitle')}</legend>

            {tour.transfer && (
              <div className="field">
                <label htmlFor="booking-hotel" className="field-label">
                  {t('booking.fields.hotel')}
                </label>
                <input {...fieldProps('hotel')} className="input" value={values.hotel} onChange={setField('hotel')} />
                <p className="field-hint">{t('booking.fields.hotelHint')}</p>
                {errorText('hotel')}
              </div>
            )}

            <div className="field">
              <label htmlFor="booking-comment" className="field-label">
                {t('booking.fields.comment')}
              </label>
              <textarea
                id="booking-comment"
                className="input"
                placeholder={t('booking.fields.commentPlaceholder')}
                value={values.comment}
                onChange={setField('comment')}
              />
            </div>

            <div className="field">
              <label className={styles.consent}>
                <input type="checkbox" {...fieldProps('consent')} checked={values.consent} onChange={setField('consent')} />
                <span>{t('booking.fields.consent')}</span>
              </label>
              <details className={styles.policy}>
                <summary>{t('booking.policyTitle')}</summary>
                <p>{tr(site.cancellation.text)}</p>
                <p>{tr(site.payment)}</p>
              </details>
              {errorText('consent')}
            </div>
          </fieldset>

          {errors.form && (
            <p className="field-error" role="alert">
              {t(errors.form)}
            </p>
          )}

          <Button type="submit" size="lg" block disabled={submitStatus === 'loading'}>
            <Lock aria-hidden="true" />
            {submitStatus === 'loading' ? t('booking.sending') : t('booking.submit', { total: fmt.price(price.total) })}
          </Button>
          <p className={styles.noPayment}>{t('booking.noPaymentNow')}</p>
        </form>

        <aside className={styles.summary} aria-labelledby="summary-title">
          <div className={styles.summaryCard}>
            <SmartImage src={cover?.src} alt="" label={tr(cover?.alt)} scene={sceneForTour(tour)} className={styles.thumb} />
            <h2 id="summary-title" className={styles.summaryTitle}>
              {title}
            </h2>
            <ul role="list" className={styles.summaryList}>
              <li>
                <CalendarDays aria-hidden="true" />
                {fmt.date(draft.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </li>
              <li>
                <Users aria-hidden="true" />
                {tp('plural.adults', draft.adults)}
                {draft.children > 0 && `, ${tp('plural.children', draft.children)}`}
              </li>
              <li>
                <Clock aria-hidden="true" />
                {fmt.duration(tour.duration)} · {t(`booking.types.${draft.type}`)}
              </li>
            </ul>

            <dl className={styles.breakdown}>
              <div>
                <dt>
                  {tp('plural.adults', draft.adults)} × {fmt.price(tour.price)}
                </dt>
                <dd>{fmt.price(price.adultsTotal)}</dd>
              </div>
              {draft.children > 0 && (
                <div>
                  <dt>
                    {tp('plural.children', draft.children)} × {fmt.price(tour.childPrice ?? tour.price)}
                  </dt>
                  <dd>{fmt.price(price.childrenTotal)}</dd>
                </div>
              )}
              {price.privateFee > 0 && (
                <div>
                  <dt>{t('booking.privateFee')}</dt>
                  <dd>+{fmt.price(price.privateFee)}</dd>
                </div>
              )}
              <div className={styles.total}>
                <dt>{t('booking.total')}</dt>
                <dd>{fmt.price(price.total)}</dd>
              </div>
            </dl>

            <ul role="list" className={styles.notes}>
              {tour.freeCancellation && (
                <li>
                  <CircleCheck aria-hidden="true" />
                  {t('tour.facts.freeCancellationText', { hours: site.cancellation.hours })}
                </li>
              )}
              <li>
                <Wallet aria-hidden="true" />
                {tr(site.payment)}
              </li>
            </ul>

            <Link to={`/tours/${tour.slug}`} className={styles.change}>
              {t('booking.change')}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
