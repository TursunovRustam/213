import { useState } from 'react';
import { cx } from '../../utils/cx';
import styles from './SmartImage.module.css';

/**
 * Картинка с ленивой загрузкой и плавным появлением.
 * Пока фото нет (или файл не найден), показывается заглушка:
 * градиент из палитры, узор гирих, силуэт города и подпись.
 *
 * scene: city | desert | mountains — какой силуэт рисовать в заглушке
 * tone: dusk | tile | clay | night | sand — цвет заглушки (по умолчанию выбирается по подписи)
 */
export default function SmartImage(props) {
  // key сбрасывает состояние загрузки, когда меняется src
  return <SmartImageInner key={props.src || 'no-image'} {...props} />;
}

// Какие цвета подходят к каждому силуэту (пустыня — только тёплые, иначе барханы не видны)
const TONES_BY_SCENE = {
  city: ['dusk', 'tile', 'clay', 'night', 'sand'],
  desert: ['clay', 'dusk', 'sand'],
  mountains: ['night', 'tile', 'dusk'],
};

function pickTone(scene, text = '') {
  const tones = TONES_BY_SCENE[scene] ?? TONES_BY_SCENE.city;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return tones[hash % tones.length];
}

function SmartImageInner({
  src,
  alt = '',
  label,
  scene = 'city',
  tone,
  priority = false,
  showLabel = true,
  fallback,
  className,
  imgClassName,
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');
  const failed = status === 'error';

  return (
    <div className={cx(styles.wrap, className)}>
      {status !== 'loaded' &&
        (fallback ?? (
          <div
            className={styles.fallback}
            data-tone={tone ?? pickTone(scene, label || alt || src)}
            role={failed && alt ? 'img' : undefined}
            aria-label={failed && alt ? alt : undefined}
            aria-hidden={failed && alt ? undefined : true}
          >
            <Scene scene={scene} />
            {showLabel && label && <span className={styles.label}>{label}</span>}
          </div>
        ))}
      {src && !failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cx(styles.img, status === 'loaded' && styles.visible, imgClassName)}
        />
      )}
    </div>
  );
}

// Силуэты для заглушек: город с минаретом, пустыня с юртами, горы
function Scene({ scene }) {
  return (
    <svg className={styles.scene} viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {scene === 'desert' && (
        <>
          <circle className={styles.sun} cx="110" cy="72" r="26" />
          <path className={styles.back} d="M0 150Q70 120 140 140T280 132T400 138V200H0Z" />
          <path d="M0 176Q90 150 190 168T400 160V200H0Z" />
          <path d="M240 170h52v-13q-26-24-52 0z" />
          <path d="M300 167h32v-8q-16-15-32 0z" />
        </>
      )}
      {scene === 'mountains' && (
        <>
          <circle className={styles.sun} cx="300" cy="52" r="18" />
          <path className={styles.back} d="M0 200V130L50 95L90 120L150 60L205 110L250 85L310 125L360 90L400 110V200Z" />
          <path d="M0 200V160L70 120L120 150L180 110L240 160L300 130L360 165L400 145V200Z" />
        </>
      )}
      {scene === 'city' && (
        <>
          <circle className={styles.sun} cx="300" cy="96" r="30" />
          <path
            className={styles.back}
            d="M0 200V160h30v-8a12 12 0 0 1 24 0v8h40v-14h26v14h30v-6a10 10 0 0 1 20 0v6h40v-10h30v10h40v-16a14 14 0 0 1 28 0v16h40v-8h52v48z"
          />
          <path d="M64 200l2-108h14l2 108zM63 92V78h20v14zM65 78q8-12 16 0zM61 92h24v3H61z" />
          <path fillRule="evenodd" d="M150 200v-92h90v92zM172 200v-50q0-18 23-26 23 8 23 26v50z" />
          <path d="M258 200v-58h70v58zM254 142c-2-30 26-40 39-50 13 10 41 20 39 50zM292 92h2V80h-2z" />
          <path d="M82 200v-30h68v30zM240 200v-40h18v40zM328 200v-28h72v28zM0 200v-24h64v24z" />
        </>
      )}
    </svg>
  );
}
