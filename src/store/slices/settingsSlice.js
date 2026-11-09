import { createSlice } from '@reduxjs/toolkit';
import { site } from '../../config/site';

export const SUPPORTED_LANGS = ['en', 'ru'];

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    lang: 'en', // язык по умолчанию
    currency: site.currency.code,
  },
  reducers: {
    setLang(state, action) {
      if (SUPPORTED_LANGS.includes(action.payload)) state.lang = action.payload;
    },
    setCurrency(state, action) {
      state.currency = action.payload;
    },
  },
});

export const { setLang, setCurrency } = settingsSlice.actions;
export default settingsSlice.reducer;

export const selectLang = (state) => state.settings.lang;
export const selectCurrency = (state) => state.settings.currency;
