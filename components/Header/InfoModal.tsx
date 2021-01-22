import styles from "./InfoModal.module.css";
import type { AudioTrack } from "../../lib/types";
import { useRef } from "react";

type Props = {
  audioTrack: AudioTrack;
  closeInfoModal: () => void;
};

const InfoModal = ({ audioTrack, closeInfoModal }: Props) => {
  const container = useRef<HTMLDivElement>();

  const close = () => {
    container.current.classList.add(styles.container__close);

    setTimeout(() => {
      closeInfoModal();
    }, 400);
  };

  return (
    <div role="dialog" className={styles.container} ref={container}>
      <div className={styles.button__close} onClick={() => close()}></div>

      <div className={styles.box}>
        <p className={styles.text}>
          <span
            role="img"
            className={styles.emoji}
            aria-label="Waving hand emoji"
          >
            👋🏻
          </span>{" "}
          Code & design by{" "}
          <a
            href="https://lukstr.dev"
            rel="noopener noreferrer"
            target="blank"
            title="Developer's website. Opens in new tab."
            className={styles.link}
          >
            Lukas Strociak
          </a>
        </p>

        <p className={styles.text}>
          <span role="img" className={styles.emoji} aria-label="Thunder emoji">
            ⚡️
          </span>
          Powered by{" "}
          <a
            href="https://archive.org"
            rel="noopener noreferrer"
            target="blank"
            title="Internet Archive main website. Opens in new tab."
            className={styles.link}
          >
            Internet Archive
          </a>
        </p>
      </div>
    </div>
  );
};

export default InfoModal;
