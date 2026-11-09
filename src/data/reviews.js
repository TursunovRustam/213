// =====================================================================
// ОТЗЫВЫ
// ВНИМАНИЕ: это ДЕМО-отзывы (isDemo: true). Перед запуском сайта замените их
// реальными отзывами гостей (например, с GetYourGuide или TripAdvisor).
//
// tourId  — id тура из data/tours.js
// country — код страны ISO (DE, US, RU…), название подставится автоматически
// date    — дата поездки в формате YYYY-MM-DD
// =====================================================================

export const reviews = [
  {
    id: 'r1',
    isDemo: true,
    tourId: 'bukhara-old-city-walk',
    name: 'Emma',
    country: 'GB',
    date: '2026-10-12',
    rating: 5,
    text: {
      en: 'Ibrokhim made the old city feel personal. He grew up a few streets from Lyabi-Hauz and it shows: every corner came with a story, and he knew exactly where to stop for the best tea afterwards.',
      ru: 'Иброхим сделал Старый город личным. Он вырос в паре улиц от Ляби-Хауза, и это чувствуется: у каждого угла была своя история, а потом он точно знал, где выпить лучший чай.',
    },
  },
  {
    id: 'r2',
    isDemo: true,
    tourId: 'desert-yurt-camp-2-days',
    name: 'Lukas',
    country: 'DE',
    date: '2026-09-28',
    rating: 5,
    text: {
      en: 'The night in the yurt camp was the highlight of our whole trip. Camels at sunset, songs around the fire and more stars than I have ever seen. Everything was organised perfectly.',
      ru: 'Ночь в юрточном лагере — главное впечатление всей поездки. Верблюды на закате, песни у костра и столько звёзд, сколько я никогда не видел. Всё было организовано идеально.',
    },
  },
  {
    id: 'r3',
    isDemo: true,
    tourId: 'bukhara-plov-master-class',
    name: 'Анна',
    country: 'RU',
    date: '2026-10-03',
    rating: 5,
    text: {
      en: 'We cooked plov in a real family home and then ate it together at one big table. Warm, delicious and very honest. The recipe already worked at home!',
      ru: 'Готовили плов в настоящем доме, а потом ели его все вместе за одним большим столом. Тепло, вкусно и очень по-настоящему. Рецепт уже получился дома!',
    },
  },
  {
    id: 'r4',
    isDemo: true,
    tourId: 'bukhara-full-day',
    name: 'Daniel',
    country: 'US',
    date: '2026-09-15',
    rating: 5,
    text: {
      en: 'One day, all of Bukhara, and never rushed. Ibrokhim adjusted the pace for my parents and found shade whenever we needed it. Chor-Minor at the end was a lovely surprise.',
      ru: 'Один день, вся Бухара — и ни разу не в спешке. Иброхим подстроил темп под моих родителей и находил тень, когда она была нужна. Чор-Минор в конце — чудесный сюрприз.',
    },
  },
  {
    id: 'r5',
    isDemo: true,
    tourId: 'bukhara-evening',
    name: 'Sophie',
    country: 'FR',
    date: '2026-08-22',
    rating: 5,
    text: {
      en: 'The golden hour at the minaret was magical, and dinner in the madrasah courtyard felt like being a guest at a celebration. Perfect first evening in Bukhara.',
      ru: 'Золотой час у минарета — волшебство, а ужин во дворе медресе был как приглашение на праздник. Идеальный первый вечер в Бухаре.',
    },
  },
  {
    id: 'r6',
    isDemo: true,
    tourId: 'samarkand-day-trip-train',
    name: 'Marco',
    country: 'IT',
    date: '2026-10-18',
    rating: 5,
    text: {
      en: 'Train tickets, transfers, lunch — we did not have to think about anything. Samarkand in one day sounded rushed, but it felt just right.',
      ru: 'Билеты на поезд, трансферы, обед — ни о чём не пришлось думать. Самарканд за один день звучал как гонка, но получилось в самый раз.',
    },
  },
  {
    id: 'r7',
    isDemo: true,
    tourId: 'gijduvan-ceramics',
    name: 'Ольга',
    country: 'KZ',
    date: '2026-09-05',
    rating: 5,
    text: {
      en: 'A real family of potters, no tourist show. I tried the wheel for the first time, and the lunch in the master’s courtyard was the best meal of our trip.',
      ru: 'Настоящая семья гончаров, никакого шоу для туристов. Впервые попробовала гончарный круг, а обед во дворе мастера стал лучшим за поездку.',
    },
  },
  {
    id: 'r8',
    isDemo: true,
    tourId: 'bukhara-countryside',
    name: 'James',
    country: 'AU',
    date: '2026-07-30',
    rating: 4,
    text: {
      en: 'Great to see the places outside the city with a comfortable car. The emir’s palace was fascinating. It was very hot in July, so go early if you can.',
      ru: 'Здорово увидеть места за городом на удобной машине. Дворец эмира — очень интересно. В июле было очень жарко, так что лучше ехать пораньше.',
    },
  },
  {
    id: 'r9',
    isDemo: true,
    tourId: 'nuratau-yurts-3-days',
    name: 'Yuki',
    country: 'JP',
    date: '2026-05-19',
    rating: 5,
    text: {
      en: 'Sentob village was so peaceful, and the family we stayed with was incredibly kind. Mountains, desert and a lake in three days — a wonderful mix.',
      ru: 'В Сентобе так спокойно, а семья, у которой мы жили, была невероятно добра к нам. Горы, пустыня и озеро за три дня — прекрасное сочетание.',
    },
  },
  {
    id: 'r10',
    isDemo: true,
    tourId: 'bukhara-old-city-walk',
    name: 'Claire',
    country: 'NL',
    date: '2026-10-25',
    rating: 5,
    text: {
      en: 'Small group, lots of humour and real knowledge. I booked the desert trip right after this walk.',
      ru: 'Маленькая группа, много юмора и настоящие знания. Сразу после прогулки забронировала поездку в пустыню.',
    },
  },
];
