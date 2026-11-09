import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { site } from '../../config/site';
import { calcPrice } from '../../utils/pricing';

// Код брони вида UZD-7K3F9Q (без похожих символов 0/O и 1/I)
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const chars = Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]);
  return `UZD-${chars.join('')}`;
}

export const emptyDraft = {
  slug: null,
  date: '',
  adults: 2,
  children: 0,
  type: 'group', // group | private
};

// Оформление брони:
// 1) создаём бронь с кодом и статусом pending;
// 2) если в .env задан VITE_BOOKING_ENDPOINT, отправляем туда JSON (POST);
// 3) бронь в любом случае сохраняется в Redux и localStorage.
export const submitBooking = createAsyncThunk(
  'booking/submit',
  async ({ tour, draft, customer, lang }, { getState }) => {
    const existing = new Set(getState().booking.bookings.map((item) => item.code));
    let code = generateCode();
    while (existing.has(code)) code = generateCode();

    const booking = {
      code,
      status: 'pending',
      createdAt: new Date().toISOString(),
      tourId: tour.id,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      date: draft.date,
      adults: draft.adults,
      children: draft.children,
      type: draft.type,
      price: calcPrice(tour, draft),
      currency: site.currency.code,
      customer,
      lang,
      delivered: null, // null — адрес не задан, true/false — результат отправки
    };

    const endpoint = import.meta.env.VITE_BOOKING_ENDPOINT;
    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(booking),
        });
        booking.delivered = response.ok;
      } catch {
        booking.delivered = false;
      }
    }

    return booking;
  },
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    draft: emptyDraft, // то, что гость выбрал в виджете на странице тура
    bookings: [],
    submitStatus: 'idle', // idle | loading | failed
  },
  reducers: {
    setDraft(state, action) {
      state.draft = { ...emptyDraft, ...action.payload };
    },
    clearDraft(state) {
      state.draft = emptyDraft;
    },
    cancelBooking(state, action) {
      const booking = state.bookings.find((item) => item.code === action.payload);
      if (booking) {
        booking.status = 'cancelled';
        booking.cancelledAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBooking.pending, (state) => {
        state.submitStatus = 'loading';
      })
      .addCase(submitBooking.fulfilled, (state, action) => {
        state.submitStatus = 'idle';
        state.bookings.unshift(action.payload);
      })
      .addCase(submitBooking.rejected, (state) => {
        state.submitStatus = 'failed';
      });
  },
});

export const { setDraft, clearDraft, cancelBooking } = bookingSlice.actions;
export default bookingSlice.reducer;

export const selectDraft = (state) => state.booking.draft;
export const selectBookings = (state) => state.booking.bookings;
export const selectSubmitStatus = (state) => state.booking.submitStatus;
export const selectBookingByCode = (state, code) =>
  state.booking.bookings.find((item) => item.code === code);
