import { useDispatch } from 'react-redux';
import { useT } from '../../i18n/useT';
import { setLang, SUPPORTED_LANGS } from '../../store/slices/settingsSlice';
import { cx } from '../../utils/cx';
import styles from './LangSwitch.module.css';

// Переключатель языка EN / RU
export default function LangSwitch({ size = 'md', className }) {
  const { t, lang } = useT();
  const dispatch = useDispatch();
  return (
    <div className={cx(styles.switch, styles[size], className)} role="group" aria-label={t('nav.language')}>
      {SUPPORTED_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={cx(styles.option, code === lang && styles.active)}
          aria-pressed={code === lang}
          onClick={() => dispatch(setLang(code))}
          lang={code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
