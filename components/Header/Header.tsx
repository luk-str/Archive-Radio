import styles from "./Header.module.css";
import { IoShareOutline } from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";

type Props = {
  isAudioReady: boolean;
  isShareModalOpen: boolean;
  isInfoModalOpen: boolean;
  openShareModal: () => void;
  openInfoModal: () => void;
};

const Header = ({
  isAudioReady,
  isShareModalOpen,
  isInfoModalOpen,
  openShareModal,
  openInfoModal,
}: Props) => (
  <header className={styles.container}>
    <button
      title="Show more info"
      className={styles.button}
      disabled={isInfoModalOpen ? true : false}
      onClick={openInfoModal}
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
      title="Share the song"
      className={`${styles.button} ${!isAudioReady && styles.inactive}`}
      disabled={!isAudioReady || isShareModalOpen ? true : false}
      onClick={openShareModal}
    >
      <IoShareOutline />
    </button>
  </header>
);

export default Header;
