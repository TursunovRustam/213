import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cx } from '../../utils/cx';
import styles from './Accordion.module.css';

// Аккордеон: items = [{ id, title, content }]. Открыт один пункт за раз.
export default function Accordion({ items, defaultOpenId = null, className }) {
  const [openId, setOpenId] = useState(defaultOpenId);
  const baseId = useId();

  return (
    <div className={cx(styles.accordion, className)}>
      {items.map((item) => {
        const isOpen = item.id === openId;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className={cx(styles.item, isOpen && styles.open)}>
            <h3 className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.title}</span>
                <Plus aria-hidden="true" className={styles.icon} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={styles.panel}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.content}>{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
