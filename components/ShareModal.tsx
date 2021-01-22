import styles from "./ShareModal.module.css";
import { AiOutlineCopy } from "react-icons/ai";
import { useRef } from "react";

type Props = {
  shareTrackUrl: string;
  closeShareModal: () => void;
};

const ShareModal = ({ shareTrackUrl, closeShareModal }: Props) => {
  const copyAlert = useRef<HTMLParagraphElement>();
  const container = useRef<HTMLDivElement>();

  const copyAndClose = (): void => {
    navigator.clipboard.writeText(shareTrackUrl);
    copyAlert.current.classList.add(styles.copied__visible);
    container.current.classList.add(styles.container__closeWithDelay);

    setTimeout(() => {
      closeShareModal();
    }, 1400);
  };

  const close = (): void => {
    container.current.classList.add(styles.container__close);

    setTimeout(() => {
      closeShareModal();
    }, 400);
  };

  return (
    <div role="dialog" className={styles.container} ref={container}>
      <div className={styles.button__close} onClick={() => close()}></div>

      <p className={styles.copied} ref={copyAlert}>
        Copied 👍
      </p>

      <article className={styles.box}>
        <h2 className={styles.header}>Copy the link to share!</h2>

        <section className={styles.link__container}>
          <p className={styles.link}>{shareTrackUrl}</p>
        </section>

        <button className={styles.button} onClick={() => copyAndClose()}>
          <AiOutlineCopy />
        </button>
      </article>
    </div>
  );
};

export default ShareModal;
