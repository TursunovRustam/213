// Сегодняшняя дата в формате YYYY-MM-DD (для <input type="date" min>)
export function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// Превращает 'YYYY-MM-DD' в локальную дату (без сдвига часового пояса)
export function parseISODate(iso) {
  if (!iso) return null;
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function isPastDate(iso) {
  return Boolean(iso) && iso < todayISO();
}
