import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { useEscape } from '../../hooks/useEscape';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import styles from './BottomSheet.module.css';

// Нижняя шторка для мобильных: фильтры каталога и виджет бронирования.
// Закрывается крестиком, по Esc, кликом по фону или свайпом вниз за «ручку».
export default function BottomSheet({ open, onClose, title, children, footer }) {
  const { t } = useT();
  const dragControls = useDragControls();
  const sheetRef = useRef(null);

  useLockBodyScroll(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    sheetRef.current?.focus();
    return () => previousFocus?.focus?.();
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={styles.root}>
          <motion.div
            className={styles.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={styles.sheet}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 320 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            <div className={styles.handleArea} onPointerDown={(event) => dragControls.start(event)}>
              <span className={styles.handle} />
            </div>
            <div className={styles.header}>
              <h2 className={styles.title}>{title}</h2>
              <button type="button" className={styles.close} onClick={onClose} aria-label={t('common.close')}>
                <X aria-hidden="true" />
              </button>
            </div>
            <div className={styles.body}>{children}</div>
            {footer && <div className={styles.footer}>{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
