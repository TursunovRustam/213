import { motion } from 'framer-motion';

// Мягкое появление блока при прокрутке: прозрачность + сдвиг на 20px.
// При prefers-reduced-motion сдвиг отключается (см. MotionConfig в App.jsx).
export default function Reveal({ delay = 0, className, children, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
