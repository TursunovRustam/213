import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import en from './en';
import ru from './ru';
import { site } from '../config/site';
import { selectLang } from '../store/slices/settingsSlice';
import { parseISODate } from '../utils/dates';

const dictionaries = { en, ru };
const LOCALES = { en: 'en-US', ru: 'ru-RU' };

function lookup(dictionary, key) {
  return key.split('.').reduce((acc, part) => (acc == null ? undefined : acc[part]), dictionary);
}

function interpolate(text, vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (vars[name] ?? match));
}

const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Хук перевода.
 *   t('nav.tours')                  — строка из словаря i18n/en.js или i18n/ru.js
 *   t('booking.hello', { name })    — с подстановкой {name}
 *   tp('plural.reviews', 5)         — с правильным окончанием: «5 отзывов»
 *   tr(tour.title)                  — поле вида { en: '...', ru: '...' } на текущем языке
 *   fmt.price(19), fmt.date('2026-05-01'), fmt.duration(tour.duration)
 */
export function useT() {
  const lang = useSelector(selectLang);

  return useMemo(() => {
    const dictionary = dictionaries[lang] ?? en;
    const locale = LOCALES[lang] ?? 'en-US';
    const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    const ratingFormat = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const priceFormat = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: site.currency.code,
      maximumFractionDigits: 0,
    });
    const pluralRules = new Intl.PluralRules(locale);
    const languageNames = new Intl.DisplayNames([locale], { type: 'language' });
    const regionNames = new Intl.DisplayNames([locale], { type: 'region' });

    const t = (key, vars) => {
      const value = lookup(dictionary, key) ?? lookup(en, key);
      if (typeof value !== 'string') {
        if (import.meta.env.DEV) console.warn(`[i18n] нет перевода: ${key}`);
        return key;
      }
      return interpolate(value, vars);
    };

    const tp = (key, count, vars) => {
      const forms = lookup(dictionary, key) ?? lookup(en, key);
      if (!forms || typeof forms !== 'object') return key;
      const form = forms[pluralRules.select(count)] ?? forms.other;
      return interpolate(form, { n: numberFormat.format(count), ...vars });
    };

    const tr = (field) => {
      if (field == null) return '';
      if (typeof field === 'string') return field;
      return field[lang] ?? field.en ?? '';
    };

    const fmt = {
      number: (value) => numberFormat.format(value),
      rating: (value) => ratingFormat.format(value),
      price: (value) => priceFormat.format(value),
      date: (iso, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
        const date = typeof iso === 'string' && iso.length === 10 ? parseISODate(iso) : new Date(iso);
        return date ? new Intl.DateTimeFormat(locale, options).format(date) : '';
      },
      duration: ({ from, value, unit }) => {
        const label = tp(`plural.${unit}`, value);
        return from ? `${numberFormat.format(from)}–${label}` : label;
      },
      language: (code) => capitalize(languageNames.of(code) ?? code),
      country: (code) => regionNames.of(code) ?? code,
    };

    return { t, tp, tr, fmt, lang, locale };
  }, [lang]);
}
