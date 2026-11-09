// Расчёт стоимости тура. Используется в виджете бронирования, на странице брони и в сводке.
export function calcPrice(tour, { adults = 1, children = 0, type = 'group' } = {}) {
  const adultsTotal = adults * tour.price;
  const childrenTotal = children * (tour.childPrice ?? tour.price);
  const privateFee = type === 'private' ? tour.privateSurcharge || 0 : 0;
  return {
    adultsTotal,
    childrenTotal,
    privateFee,
    total: adultsTotal + childrenTotal + privateFee,
  };
}

export function discountPercent(tour) {
  if (!tour.oldPrice || tour.oldPrice <= tour.price) return 0;
  return Math.round((1 - tour.price / tour.oldPrice) * 100);
}

// Тип тура по длительности: для фильтра «несколько часов / весь день / несколько дней»
export function durationType(tour) {
  if (tour.duration.unit === 'days') return 'multi-day';
  return tour.duration.value > 5 ? 'full-day' : 'short';
}

// Какую иллюстрацию рисовать, пока нет настоящего фото
export function sceneForTour(tour) {
  if (tour.region === 'desert') return 'desert';
  if (tour.category === 'nature') return 'mountains';
  return 'city';
}
