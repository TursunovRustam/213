import { site } from '../config/site';

// Готовый текст брони для WhatsApp / Telegram. i18n = объект из useT()
export function buildBookingMessage(booking, { t, tp, tr, fmt }) {
  const guests = [tp('plural.adults', booking.adults)];
  if (booking.children) guests.push(tp('plural.children', booking.children));

  const lines = [
    t('success.message.greeting', { name: tr(site.guide.firstName) }),
    t('success.message.intro'),
    '',
    `${t('success.message.code')}: ${booking.code}`,
    `${t('success.message.tour')}: ${tr(booking.tourTitle)}`,
    `${t('success.message.date')}: ${fmt.date(booking.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`,
    `${t('success.message.guests')}: ${guests.join(', ')}`,
    `${t('success.message.type')}: ${t(`booking.types.${booking.type}`)}`,
    `${t('success.message.total')}: ${fmt.price(booking.price.total)}`,
    '',
    `${t('success.message.name')}: ${booking.customer.name}`,
    `${t('success.message.phone')}: ${booking.customer.phone}`,
  ];
  if (booking.customer.hotel) lines.push(`${t('success.message.hotel')}: ${booking.customer.hotel}`);
  if (booking.customer.comment) lines.push(`${t('success.message.comment')}: ${booking.customer.comment}`);
  return lines.join('\n');
}
