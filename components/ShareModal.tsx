import styles from "./ShareModal.module.css";
import { AiOutlineCopy } from "react-icons/ai";

type Props = {
  shareTrackUrl: string;
  closeShareModal: () => void;
};

const ShareModal = ({ shareTrackUrl, closeShareModal }: Props) => {
  return (
    <div role="dialog" className={styles.container}>
      <div className={styles.button__close} onClick={closeShareModal}></div>

      <article className={styles.box}>
        <h2 className={styles.header}>Share this url</h2>
        <section className={styles.link__container}>
          <p className={styles.link}>{shareTrackUrl}</p>
        </section>
        <button
          className={styles.button}
          onClick={() => {
            navigator.clipboard.writeText(shareTrackUrl);
          }}
        >
          <AiOutlineCopy />
        </button>
      </article>
    </div>
  );
};

export default ShareModal;
