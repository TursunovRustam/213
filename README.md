# Uzbekistan Dreams — сайт личного гида по Бухаре

Сайт туров с гидом Иброхимом Икромовичем: каталог туров, страницы туров, бронирование, избранное, переключатель EN / RU.

**Технологии:** React + Vite (JavaScript), Redux Toolkit, react-router-dom, CSS Modules, framer-motion, lucide-react, шрифты через @fontsource. Бэкенда нет — все данные лежат в JS-файлах.

---

## ⚠️ Перед запуском сайта (чек-лист)

- [ ] **Заменить демо-отзывы и рейтинги на реальные** (например, с GetYourGuide / TripAdvisor):
  - отзывы — `src/data/reviews.js` (сейчас все помечены `isDemo: true`);
  - рейтинг и число отзывов каждого тура — поля `rating` и `reviewsCount` в `src/data/tours.js`.
- [ ] Указать реальные контакты в `src/config/site.js` (телефон, WhatsApp, Telegram, email, Instagram).
- [ ] Проверить биографию гида: всё, что помечено `[TODO]`, — в `src/config/site.js` (стаж, языки, лицензия) и в `src/i18n/en.js` / `src/i18n/ru.js` (раздел `about`).
- [ ] Добавить фото в `public/images/` (список ниже). Пока фото нет, сайт показывает красивые заглушки.
- [ ] Указать адрес сайта (`url`) в `src/config/site.js`.
- [ ] Решить, какие туры за пределами Бухары оставить (`active: false` — скрыть).
- [ ] Подключить отправку броней (`VITE_BOOKING_ENDPOINT`, см. ниже) — иначе брони видит только гость.

---

## Как запустить

Нужен [Node.js](https://nodejs.org) версии 20.19 или новее (лучше 22+).

```bash
npm install
```

```bash
npm run dev
```

Сайт откроется на http://localhost:5173.

Другие команды:

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm run lint
```

`build` собирает готовый сайт в папку `dist`, `preview` показывает собранную версию, `lint` проверяет код (ESLint).

---

## Структура проекта

```
src/
  config/site.js        ← бренд, имя гида, контакты, валюта, политика отмены, главные фото
  config/navigation.js  ← пункты меню в шапке
  data/tours.js         ← ВСЕ ТУРЫ (главный файл для редактирования)
  data/reviews.js       ← отзывы (демо)
  data/faq.js           ← частые вопросы
  data/countries.js     ← страны в форме бронирования
  i18n/en.js, ru.js     ← тексты интерфейса на английском и русском
  i18n/useT.js          ← хук перевода t(), tp() для чисел, tr() для полей { en, ru }
  store/                ← Redux: туры и фильтры, бронирования, избранное, язык
  components/layout/    ← шапка, футер, мобильное меню, кнопка связи
  components/ui/        ← кнопки, бейджи, рейтинг, цена, счётчик, аккордеон, картинка, арка, орнамент
  components/tours/     ← карточка тура, сетка, фильтры, виджет бронирования, галерея, программа, отзывы
  components/home/      ← секции главной страницы
  pages/                ← страницы сайта
  styles/variables.css  ← ВСЕ ЦВЕТА, ШРИФТЫ И ОТСТУПЫ
  styles/global.css     ← базовые стили
public/images/          ← фото
```

---

## Туры: добавить, скрыть, изменить цену

Все туры — в `src/data/tours.js`. Каждый тур — это объект `{ ... }` в списке.

**Изменить цену.** Найдите тур и поменяйте:

```js
price: 19,        // цена «от» за взрослого
oldPrice: 25,     // старая цена — покажется зачёркнутой, бейдж «−24%» посчитается сам. null — без скидки
childPrice: 10,   // дети 4–11 лет (до 4 лет бесплатно)
privateSurcharge: 30, // доплата за индивидуальный тур — одна на всю группу
```

**Скрыть тур.** Поставьте `active: false` — тур пропадёт из каталога, с главной и из поиска. Удалять не нужно.

**Блок «За пределами Бухары».** На главной показываются туры с `outsideBukhara: true`. Если все такие туры скрыты, блок исчезает сам. Карточка направления (Самарканд, Хива…) тоже скрывается, если в регионе нет активных туров.

**Добавить тур.**

1. Скопируйте любой тур целиком (от `{` до `},`).
2. Поменяйте `id` и `slug` — латиницей через дефис, например `bukhara-sunrise-walk`. `slug` — это адрес страницы: `/tours/bukhara-sunrise-walk`.
3. Заполните тексты на двух языках: `{ en: '...', ru: '...' }`.
4. Добавьте фото в `public/images/tours/` и пропишите пути в `images`.

Полезные поля:

| Поле | Что значит |
|---|---|
| `region` | `bukhara`, `samarkand`, `khiva`, `tashkent`, `desert`, `multi` — для фильтра и карточек направлений |
| `category` | `walking`, `day-trip`, `multi-day`, `food`, `culture`, `nature` |
| `duration` | `{ value: 3, unit: 'hours' }` или `{ value: 2, unit: 'days' }`; диапазон: `{ from: 7, value: 8, unit: 'hours' }` → «7–8 часов» |
| `transfer` | `true` — бейдж «Трансфер из отеля» и поле «Отель» в форме брони |
| `badges` | `['bestseller']`, `['new']`, `['likely-to-sell-out']` |
| `maxGroupSize` | максимум гостей в виджете бронирования |
| `itinerary` | программа: `time: '09:00'` для однодневных туров, `day: 1` для многодневных |
| `meetingPoint.mapQuery` | что искать на Google Картах, например `'Lyabi-Hauz, Bukhara'` |

Тип в фильтре «Длительность» считается сам: до 5 часов — «несколько часов», больше — «весь день», в днях — «несколько дней».

---

## Контакты, имя, бренд, валюта

Всё в `src/config/site.js`:

- `brand` — название сайта (меняется везде, включая логотип);
- `guide` — имя гида на двух языках, родной город, языки, стаж, лицензия, портрет;
- `contacts` — телефон, WhatsApp (только цифры: `998901234567`), Telegram и Instagram (без `@`), email;
- `currency` — валюта цен: `{ code: 'USD', symbol: '$' }`. Цены форматируются автоматически (`$19` в английской версии, `19 $` в русской). Если поменяете на `EUR`, поменяйте и цены в `tours.js` — конвертации нет;
- `cancellation` — сколько часов до начала бесплатная отмена и текст правил;
- `payment` — как гость платит.

Тексты интерфейса (кнопки, заголовки, подписи) — в `src/i18n/en.js` и `src/i18n/ru.js`. Ключи в обоих файлах одинаковые.

---

## Цвета и шрифты

Вся палитра — в `src/styles/variables.css`. Поменяйте значение — оно поменяется на всём сайте:

| Токен | Цвет | Где используется |
|---|---|---|
| `--sand-50` | #FBF6EE | основной фон |
| `--sand-200` | #EADCC4 | второстепенные фоны |
| `--clay-600` | #B5562B | главные кнопки, акценты |
| `--turquoise-500` / `--turquoise-700` | #1F8A8A / #146B6B | иконки / ссылки и бейджи (700 — для текста, контраст AA) |
| `--lapis-900` | #14304D | тёмные секции, футер |
| `--saffron-400` | #D9A441 | золото, звёзды, орнамент |
| `--ink-900` | #1F1A17 | текст |

Шрифты: **Fraunces** — заголовки, **Manrope** — текст. В Fraunces нет кириллицы, поэтому русские заголовки автоматически набираются шрифтом **Lora** (тоже с засечками). Подключение шрифтов — в `src/main.jsx`.

---

## Отправка броней гиду (`VITE_BOOKING_ENDPOINT`)

Когда гость бронирует тур:

1. Бронь сохраняется в его браузере (раздел «Мои бронирования») с кодом вида `UZD-7K3F9Q`.
2. Если задан `VITE_BOOKING_ENDPOINT`, сайт отправляет туда бронь (POST, JSON).
3. На странице успеха гость может одним нажатием отправить бронь гиду в WhatsApp или Telegram.

**Без настройки гид узнаёт о брони, только если гость отправит её в мессенджер.** Чтобы брони приходили на почту, проще всего подключить [Formspree](https://formspree.io):

1. Зарегистрируйтесь и создайте форму — получите адрес вида `https://formspree.io/f/abcdwxyz`.
2. В корне проекта создайте файл `.env` (образец — `.env.example`):

   ```
   VITE_BOOKING_ENDPOINT=https://formspree.io/f/abcdwxyz
   ```

3. Перезапустите `npm run dev`. На Vercel ту же переменную добавьте в **Settings → Environment Variables** и пересоберите сайт.

Подойдёт и свой сервер — любой адрес, который принимает POST с JSON. EmailJS принимает данные в своём формате, поэтому для него придётся поправить функцию `submitBooking` в `src/store/slices/bookingSlice.js`.

### Подключение API в будущем

Туры загружаются через `fetchTours` (`createAsyncThunk`) в `src/store/slices/toursSlice.js`. Сейчас функция возвращает данные из `data/tours.js`; чтобы брать туры с сервера, замените её тело на `fetch(...)` — компоненты переписывать не нужно.

---

## Деплой на Vercel

1. Загрузите проект на GitHub.
2. На [vercel.com](https://vercel.com) нажмите **Add New → Project** и выберите репозиторий.
3. Vercel сам определит Vite. Настройки по умолчанию: Build Command `npm run build`, Output Directory `dist`.
4. При необходимости добавьте `VITE_BOOKING_ENDPOINT` в Environment Variables.
5. Нажмите **Deploy**.

Файл `vercel.json` уже настроен: прямые ссылки вида `/tours/bukhara-old-city-walk` открываются без ошибки 404. Для Netlify то же самое делает `public/_redirects`.

---

## Фото

Пока фото нет, вместо них показываются заглушки (градиент, узор гирих, силуэт города и подпись), так что сайт не выглядит сломанным. Чтобы поставить настоящее фото, положите файл с **точно таким же именем** в нужную папку — код менять не нужно.

Рекомендации: JPG или WebP, до 300 КБ (сжать можно на [squoosh.app](https://squoosh.app)), горизонтальные фото туров — 1600 × 1200 (4:3).

### Главные (`public/images/hero/`)

| Файл | Что на фото | Размер |
|---|---|---|
| `bukhara-sunset-poi-kalyan.jpg` | Минарет Калян и ансамбль Пои-Калян на закате, тёплый свет | 2400 × 1600, горизонтальное |

### Гид (`public/images/guide/`)

| Файл | Что на фото |
|---|---|
| `ibrokhim-portrait.jpg` | Портрет Иброхима, вертикальный 3:4 (1200 × 1600), лицо в верхней трети — сверху кадр обрезается аркой |
| `ibrokhim-lyabi-hauz.jpg` | Иброхим с гостями у Ляби-Хауза |
| `ibrokhim-kalyan.jpg` | Иброхим у минарета Калян |
| `ibrokhim-desert.jpg` | Вечер в юрточном лагере |
| `ibrokhim-plov.jpg` | Готовит плов с гостями |
| `ibrokhim-bazaar.jpg` | Утро на бухарском базаре |
| `ibrokhim-family.jpg` | Чай во дворе у семьи |

Фото галереи — квадратные (1200 × 1200).

### Направления (`public/images/destinations/`)

Вертикальные фото примерно 3:4 (900 × 1260) — они показываются в арке.

| Файл | Что на фото |
|---|---|
| `bukhara.jpg` | Бухара: купола и минареты Старого города |
| `desert.jpg` | Пустыня Кызылкум: барханы, юрты или верблюды |
| `samarkand.jpg` | Самарканд: Регистан |
| `khiva.jpg` | Хива: Ичан-Кала, минарет Кальта-Минор |
| `tashkent-mountains.jpg` | Горы Чимган или Чарвакское водохранилище |

### Туры (`public/images/tours/`)

У каждого тура 5 фото: `<slug>-1.jpg` … `<slug>-5.jpg`. Первое — обложка карточки и большое фото в галерее.

| Файл | Что на фото |
|---|---|
| `bukhara-old-city-walk-1.jpg` | Хауз Ляби-Хауз и медресе Нодир-Диванбеги |
| `bukhara-old-city-walk-2.jpg` | Мечеть Магоки-Аттори |
| `bukhara-old-city-walk-3.jpg` | Торговый купол Токи-Заргарон |
| `bukhara-old-city-walk-4.jpg` | Минарет Калян |
| `bukhara-old-city-walk-5.jpg` | Купола медресе Мири-Араб |
| `bukhara-full-day-1.jpg` | Ворота крепости Арк |
| `bukhara-full-day-2.jpg` | Деревянные колонны мечети Боло-Хауз |
| `bukhara-full-day-3.jpg` | Мавзолей Саманидов |
| `bukhara-full-day-4.jpg` | Чор-Минор |
| `bukhara-full-day-5.jpg` | Площадь Пои-Калян на закате |
| `bukhara-countryside-1.jpg` | Дворец Ситораи Мохи-Хоса |
| `bukhara-countryside-2.jpg` | Белый зал дворца эмира |
| `bukhara-countryside-3.jpg` | Комплекс Бахауддина Накшбанда |
| `bukhara-countryside-4.jpg` | Некрополь Чор-Бакр |
| `bukhara-countryside-5.jpg` | Павлины в саду дворца |
| `bukhara-evening-1.jpg` | Минарет Калян на закате |
| `bukhara-evening-2.jpg` | Вечерние переулки Старого города |
| `bukhara-evening-3.jpg` | Ночная подсветка Ляби-Хауза |
| `bukhara-evening-4.jpg` | Фольклорное шоу во дворе медресе |
| `bukhara-evening-5.jpg` | Стол с блюдами бухарской кухни |
| `bukhara-plov-master-class-1.jpg` | Плов в казане на огне |
| `bukhara-plov-master-class-2.jpg` | Нарезка жёлтой моркови |
| `bukhara-plov-master-class-3.jpg` | Семейный двор в Старом городе |
| `bukhara-plov-master-class-4.jpg` | Лепёшки и салаты |
| `bukhara-plov-master-class-5.jpg` | Гости за семейным столом |
| `gijduvan-ceramics-1.jpg` | Гиждуванские тарелки с жёлтой и зелёной глазурью |
| `gijduvan-ceramics-2.jpg` | Мастер за гончарным кругом |
| `gijduvan-ceramics-3.jpg` | Ручная роспись керамики |
| `gijduvan-ceramics-4.jpg` | Обед во дворе мастера |
| `gijduvan-ceramics-5.jpg` | Мавзолей Абдулхалика Гиждувани |
| `desert-yurt-camp-2-days-1.jpg` | Юрточный лагерь в пустыне Кызылкум |
| `desert-yurt-camp-2-days-2.jpg` | Верблюды на закате |
| `desert-yurt-camp-2-days-3.jpg` | Костёр под звёздами |
| `desert-yurt-camp-2-days-4.jpg` | Озеро Айдаркуль |
| `desert-yurt-camp-2-days-5.jpg` | Крепость Нурата и святой источник |
| `nuratau-yurts-3-days-1.jpg` | Кишлак Сентоб в Нуратинских горах |
| `nuratau-yurts-3-days-2.jpg` | Петроглифы Сармышсая |
| `nuratau-yurts-3-days-3.jpg` | Горная тропа над кишлаком |
| `nuratau-yurts-3-days-4.jpg` | Юрты в пустыне в сумерках |
| `nuratau-yurts-3-days-5.jpg` | Берег озера Айдаркуль |
| `samarkand-day-trip-train-1.jpg` | Площадь Регистан |
| `samarkand-day-trip-train-2.jpg` | Скоростной поезд «Афросиаб» |
| `samarkand-day-trip-train-3.jpg` | Мавзолей Гур-Эмир |
| `samarkand-day-trip-train-4.jpg` | Некрополь Шахи-Зинда |
| `samarkand-day-trip-train-5.jpg` | Мечеть Биби-Ханым |
| `samarkand-walking-tour-1.jpg` | Медресе Шердор на Регистане |
| `samarkand-walking-tour-2.jpg` | Купол Гур-Эмира |
| `samarkand-walking-tour-3.jpg` | Сиабский базар |
| `samarkand-walking-tour-4.jpg` | Изразцы Шахи-Зинды |
| `samarkand-walking-tour-5.jpg` | Портал мечети Биби-Ханым |
| `shakhrisabz-from-samarkand-1.jpg` | Портал Ак-Сарая и памятник Амиру Темуру |
| `shakhrisabz-from-samarkand-2.jpg` | Перевал Тахтакарача |
| `shakhrisabz-from-samarkand-3.jpg` | Мечеть Кок-Гумбаз |
| `shakhrisabz-from-samarkand-4.jpg` | Мавзолей Джахонгира |
| `shakhrisabz-from-samarkand-5.jpg` | Старые улицы Шахрисабза |
| `khiva-2-days-1.jpg` | Минарет Кальта-Минор |
| `khiva-2-days-2.jpg` | Стены Ичан-Калы на закате |
| `khiva-2-days-3.jpg` | Резные колонны Джума-мечети |
| `khiva-2-days-4.jpg` | Дорога через Кызылкум |
| `khiva-2-days-5.jpg` | Двор дворца Таш-Хаули |
| `tashkent-metro-chorsu-1.jpg` | Станция метро «Космонавтлар» |
| `tashkent-metro-chorsu-2.jpg` | Зелёный купол базара Чорсу |
| `tashkent-metro-chorsu-3.jpg` | Станция метро «Алишер Навои» |
| `tashkent-metro-chorsu-4.jpg` | Специи и сухофрукты на Чорсу |
| `tashkent-metro-chorsu-5.jpg` | Медресе Кукельдаш |
| `tashkent-mountains-charvak-1.jpg` | Чарвакское водохранилище |
| `tashkent-mountains-charvak-2.jpg` | Канатная дорога Амирсой |
| `tashkent-mountains-charvak-3.jpg` | Горные луга Чимгана |
| `tashkent-mountains-charvak-4.jpg` | Вид на Чаткальский хребет |
| `tashkent-mountains-charvak-5.jpg` | Обед с видом на горы |
| `classic-uzbekistan-7-days-1.jpg` | Ночной Регистан |
| `classic-uzbekistan-7-days-2.jpg` | Ансамбль Пои-Калян в Бухаре |
| `classic-uzbekistan-7-days-3.jpg` | Ичан-Кала в Хиве |
| `classic-uzbekistan-7-days-4.jpg` | Ташкент, комплекс Хаст-Имам |
| `classic-uzbekistan-7-days-5.jpg` | Дорога через Кызылкум |

Подписи к фото (атрибут `alt`) уже заполнены в `data/tours.js` на двух языках. Если на фото другое место — поправьте `alt` там же.

---

## Что хранится в браузере гостя

В `localStorage` (без отдельных библиотек, раз в полсекунды) сохраняются язык, избранное, брони и последний выбор в виджете бронирования. Если поменяете структуру этих данных, увеличьте версию ключа `uzbekistan-dreams:v1` в `src/store/index.js`.
