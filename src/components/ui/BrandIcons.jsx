// Иконки мессенджеров в том же линейном стиле, что и lucide-react

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function WhatsAppIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M3.6 20.4l1.3-3.9A8.6 8.6 0 1 1 8 19.3z" />
      <path d="M9.2 8.6c.2-.5.6-.6.9-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.7-.6.9-.6.3-1.6.4-3-.3a8.2 8.2 0 0 1-3.6-3.6c-.7-1.4-.6-2.4-.3-3z" />
    </svg>
  );
}

export function TelegramIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M21.2 4.1 2.9 11.2c-.8.3-.8 1.4 0 1.7l4.4 1.5 1.7 5.3c.2.6 1 .8 1.5.4l2.5-2.3 4.6 3.4c.6.4 1.4.1 1.6-.6l3-14.6c.2-.8-.6-1.4-1.3-1.1z" />
      <path d="m7.4 14.3 9.3-6.6-6.5 7.3" />
    </svg>
  );
}

export function InstagramIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
    </svg>
  );
}
