import styles from "./Header.module.css";
import { IoShareOutline } from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";

type Props = {
  isAudioReady: boolean;
  isShareModalOpen: boolean;
  openShareModal: () => void;
};

const Header = ({ isAudioReady, isShareModalOpen, openShareModal }: Props) => (
  <header className={styles.container}>
    <button
      // className={`${styles.button} ${!isAudioReady && styles.inactive}`}
      // disabled={isAudioReady ? false : true}
      className={`${styles.button} ${styles.inactive}`}
      disabled
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
      disabled={!isAudioReady || isShareModalOpen ? true : false}
      onClick={openShareModal}
    >
      <IoShareOutline />
    </button>
  </header>
);

export default Header;
