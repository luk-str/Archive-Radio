import styles from "./Header.module.css";
import { IoShareOutline } from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";

type Props = {
  shareTrackUrl: string;
};

const Header = ({ shareTrackUrl }: Props) => (
  <header className={styles.container}>
    <button className={`${styles.button} ${styles.button__info}`}>
      <AiOutlineInfoCircle />
    </button>

    <a
      href="/"
      title="Reload Archive Radio"
      className={styles.title__container}
    >
      <h1 className={styles.title}>Archive Radio</h1>
    </a>

    <button className={`${styles.button} ${styles.button_share}`}>
      <IoShareOutline />
    </button>
  </header>
);

export default Header;
