import styles from './HeroScene.module.css';

// Иллюстрация вместо фото hero, пока нет настоящего снимка:
// закат над Бухарой — мечеть Калян, минарет Калян и бирюзовые купола Мири-Араб.
export default function HeroScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <svg className={styles.skyline} viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice">
        <defs>
          <radialGradient id="hero-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE2A8" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#F2B36A" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F2B36A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="730" cy="430" r="300" fill="url(#hero-sun)" />
        <circle cx="730" cy="430" r="70" fill="#FFE7B8" opacity="0.9" />

        {/* Дальний план: крыши и маленькие купола */}
        <path
          className={styles.far}
          d="M0 600V478h54v-12a22 22 0 0 1 44 0v12h74v-26h40v26h66v-12a18 18 0 0 1 36 0v12h84v-20h30v20h220v-10h40v10h96v-14a24 24 0 0 1 48 0v14h88v-24h36v24h70v-12a20 20 0 0 1 40 0v12h76v-18h44v18h86v-10a18 18 0 0 1 36 0v10h56V600Z"
        />

        {/* Мечеть Калян: стена, портал с аркой и большой купол */}
        <path className={styles.near} d="M150 600V456H630V600Z" />
        <path className={styles.near} fillRule="evenodd" d="M300 600V330H440V600ZM328 600V422Q328 386 370 370Q412 386 412 422V600Z" />
        <path className={styles.near} d="M292 330h14v-26h-14zM434 330h14v-26h-14z" />
        <path className={styles.near} d="M482 456V408H590V456Z" />
        <path className={styles.dome} d="M476 410C470 352 520 330 536 300C552 330 602 352 596 410Z" />
        <path className={styles.near} d="M534 300h4v-24h-4z" />

        {/* Минарет Калян */}
        <path className={styles.near} d="M690 600L702 176H758L770 600Z" />
        <path
          className={styles.near}
          fillRule="evenodd"
          d="M696 176V120H764V176ZM708 170V142Q708 132 716 129Q724 132 724 142V170ZM736 170V142Q736 132 744 129Q752 132 752 142V170Z"
        />
        <path className={styles.near} d="M688 122h84v-10h-84zM700 112L702 92Q730 78 758 92L760 112Z" />

        {/* Медресе Мири-Араб: стена, портал и два бирюзовых купола */}
        <path className={styles.near} d="M820 600V462H1310V600Z" />
        <path className={styles.near} fillRule="evenodd" d="M990 600V340H1130V600ZM1018 600V426Q1018 392 1060 378Q1102 392 1102 426V600Z" />
        <path className={styles.near} d="M982 340h14v-24h-14zM1124 340h14v-24h-14z" />
        <path className={styles.near} d="M886 462V420H954V462ZM1166 462V420H1234V462Z" />
        <path className={styles.dome} d="M880 422C876 374 910 356 920 334C930 356 964 374 960 422ZM1160 422C1156 374 1190 356 1200 334C1210 356 1244 374 1240 422Z" />

        <path className={styles.ground} d="M0 600V572H1440V600Z" />
      </svg>
    </div>
  );
}
