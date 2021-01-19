import styles from "./Header.module.css";
import { IoShareOutline } from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";

type Props = {
  shareTrackUrl: string;
  isAudioReady: boolean;
};

const Header = ({ shareTrackUrl, isAudioReady }: Props) => (
  <header className={styles.container}>
    <button
      className={`${styles.button} ${!isAudioReady && styles.inactive}`}
      disabled={isAudioReady ? false : true}
    >
      <AiOutlineInfoCircle />
    </button>

    <a
      href="/"
      title="Reload Archive Radio"
      className={styles.title__container}
    >
      <h1 className={styles.title}>Archive Radio</h1>
    </a>

    <button
      className={`${styles.button} ${!isAudioReady && styles.inactive}`}
      disabled={isAudioReady ? false : true}
    >
      <IoShareOutline />
    </button>
  </header>
);

export default Header;
