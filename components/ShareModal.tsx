import styles from "./ShareModal.module.css";
import { AiOutlineCopy } from "react-icons/ai";
import { useRef } from "react";

type Props = {
  shareTrackUrl: string;
  closeShareModal: () => void;
};

const ShareModal = ({ shareTrackUrl, closeShareModal }: Props) => {
  const copyAlert = useRef<HTMLParagraphElement>();

  const copyAndClose = (): void => {
    navigator.clipboard.writeText(shareTrackUrl);
    copyAlert.current.classList.add(styles.copied__visible);

    setTimeout(() => {
      closeShareModal();
    }, 1300);
  };

  return (
    <div role="dialog" className={styles.container}>
      <div className={styles.button__close} onClick={closeShareModal}></div>
      <p className={styles.copied} ref={copyAlert}>
        Copied 👍
      </p>
      <article className={styles.box}>
        <h2 className={styles.header}>Copy the link to share!</h2>
        <section className={styles.link__container}>
          <p className={styles.link}>{shareTrackUrl}</p>
        </section>
        <button
          className={styles.button}
          onClick={() => {
            copyAndClose();
          }}
        >
          <AiOutlineCopy />
        </button>
      </article>
    </div>
  );
};

export default ShareModal;
