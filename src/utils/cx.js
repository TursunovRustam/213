// Склеивает CSS-классы, пропуская пустые значения: cx('a', false && 'b', 'c') → 'a c'
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
