// =====================================================================
// ГЛАВНЫЕ НАСТРОЙКИ САЙТА
// Название бренда, имя гида, контакты, валюта, политика отмены и фото.
// Всё, что помечено [TODO], нужно заменить реальными данными перед запуском.
// =====================================================================

export const site = {
  // Название бренда — меняется на всём сайте
  brand: 'Uzbekistan Dreams',

  // Адрес сайта (для ссылок «Поделиться») [TODO]
  url: 'https://uzbekistan-dreams.example',

  guide: {
    name: { en: 'Ibrokhim Ikromovich', ru: 'Иброхим Икромович' },
    firstName: { en: 'Ibrokhim', ru: 'Иброхим' },
    hometown: { en: 'Bukhara', ru: 'Бухара' },
    // Языки, на которых гид проводит экскурсии (коды ISO). [TODO] проверить
    languages: ['en', 'ru', 'uz'],
    // Стаж в годах [TODO] указать реальный
    experienceYears: 10,
    // Лицензия гида [TODO] указать номер и орган, который её выдал
    license: {
      en: 'Licensed tour guide of the Republic of Uzbekistan',
      ru: 'Лицензированный гид Республики Узбекистан',
    },
    portrait: '/images/guide/ibrokhim-portrait.jpg',
    // Фото для страницы «О гиде» [TODO] добавить файлы в public/images/guide/
    gallery: [
      { src: '/images/guide/ibrokhim-lyabi-hauz.jpg', alt: { en: 'Ibrokhim with guests at Lyabi-Hauz', ru: 'Иброхим с гостями у Ляби-Хауза' } },
      { src: '/images/guide/ibrokhim-kalyan.jpg', alt: { en: 'Under the Kalyan minaret', ru: 'У минарета Калян' } },
      { src: '/images/guide/ibrokhim-desert.jpg', alt: { en: 'Evening at the yurt camp', ru: 'Вечер в юрточном лагере' } },
      { src: '/images/guide/ibrokhim-plov.jpg', alt: { en: 'Cooking plov with guests', ru: 'Готовим плов с гостями' } },
      { src: '/images/guide/ibrokhim-bazaar.jpg', alt: { en: 'Morning at the Bukhara bazaar', ru: 'Утро на бухарском базаре' } },
      { src: '/images/guide/ibrokhim-family.jpg', alt: { en: 'Tea in the family courtyard', ru: 'Чай во дворе у семьи' } },
    ],
  },

  // Контакты [TODO] заменить на реальные
  contacts: {
    phone: '+998 XX XXX XX XX',
    whatsapp: '998000000000', // только цифры, без «+» и пробелов
    telegram: 'username', // без «@»
    email: 'hello@uzbekistan-dreams.example',
    instagram: 'username', // без «@»
    city: { en: 'Bukhara, Uzbekistan', ru: 'Бухара, Узбекистан' },
  },

  // Валюта цен в data/tours.js
  currency: { code: 'USD', symbol: '$' },

  // Политика отмены (показывается на странице тура и при бронировании)
  cancellation: {
    hours: 24,
    text: {
      en: 'Cancel up to 24 hours before the start of the tour for a full refund. Later cancellations and no-shows are not refunded.',
      ru: 'Отмена не позднее чем за 24 часа до начала тура — полный возврат. При более поздней отмене или неявке деньги не возвращаются.',
    },
  },

  // Как гость платит (схема «бронируй сейчас — плати потом») [TODO] уточнить
  payment: {
    en: 'No prepayment. You pay the guide on the day of the tour in cash (USD or UZS) or by card.',
    ru: 'Без предоплаты. Оплата гиду в день тура наличными (USD или сумы) или картой.',
  },

  // Возраст детей для детского тарифа
  childAge: { from: 4, to: 11 },

  // Главные фото
  images: {
    hero: '/images/hero/bukhara-sunset-poi-kalyan.jpg',
    heroAlt: {
      en: 'Kalyan minaret and the Po-i-Kalyan ensemble in Bukhara at sunset',
      ru: 'Минарет Калян и ансамбль Пои-Калян в Бухаре на закате',
    },
  },

  // Карточки «Направления» на главной. region должен совпадать с region туров.
  // Если в регионе нет активных туров, карточка скрывается автоматически.
  destinations: [
    {
      id: 'bukhara',
      region: 'bukhara',
      title: { en: 'Bukhara', ru: 'Бухара' },
      image: '/images/destinations/bukhara.jpg',
      scene: 'city',
      tone: 'dusk',
    },
    {
      id: 'desert',
      region: 'desert',
      title: { en: 'Desert & yurts', ru: 'Пустыня и юрты' },
      image: '/images/destinations/desert.jpg',
      scene: 'desert',
      tone: 'clay',
    },
    {
      id: 'samarkand',
      region: 'samarkand',
      title: { en: 'Samarkand', ru: 'Самарканд' },
      image: '/images/destinations/samarkand.jpg',
      scene: 'city',
      tone: 'tile',
    },
    {
      id: 'khiva',
      region: 'khiva',
      title: { en: 'Khiva', ru: 'Хива' },
      image: '/images/destinations/khiva.jpg',
      scene: 'city',
      tone: 'sand',
    },
    {
      id: 'tashkent',
      region: 'tashkent',
      title: { en: 'Tashkent & mountains', ru: 'Ташкент и горы' },
      image: '/images/destinations/tashkent-mountains.jpg',
      scene: 'mountains',
      tone: 'night',
    },
  ],
};

// ---------- Ссылки на мессенджеры (собираются из контактов выше) ----------

export const whatsappLink = (text) =>
  `https://wa.me/${site.contacts.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const telegramLink = () => `https://t.me/${site.contacts.telegram}`;

export const instagramLink = () => `https://instagram.com/${site.contacts.instagram}`;

export const phoneLink = () => `tel:${site.contacts.phone.replace(/[^\d+]/g, '')}`;
