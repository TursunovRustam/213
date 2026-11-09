import { cx } from '../../utils/cx';
import styles from './ArchFrame.module.css';

// Верх арки в системе координат шириной 100. pointed — стрельчатая арка айвана, round — полукруглая.
const ARCH_TOP = {
  pointed: 'L0 30 Q0 8 50 0 Q100 8 100 30',
  round: 'L0 50 A50 50 0 0 1 100 50',
};

/**
 * Рамка-арка, как айван медресе. Внутрь кладётся фото (SmartImage).
 * ratio — соотношение ширины к высоте (3/4 = портрет), outline — золотой контур со сдвигом.
 */
export default function ArchFrame({ ratio = 3 / 4, shape = 'pointed', outline = false, className, children }) {
  const height = Math.round((100 / ratio) * 100) / 100;
  const path = `M0 ${height} ${ARCH_TOP[shape] ?? ARCH_TOP.pointed} L100 ${height} Z`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 ${height}' preserveAspectRatio='none'><path d='${path}'/></svg>`;
  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  return (
    <div className={cx(styles.frame, className)} style={{ aspectRatio: ratio }}>
      {outline && (
        <svg className={styles.outline} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={path} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <div className={styles.inner} style={{ maskImage: mask, WebkitMaskImage: mask }}>
        {children}
      </div>
    </div>
  );
}
