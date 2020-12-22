import styles from "./Controls.module.css";

type Props = {
  loadPreviousTrack: () => void;
  loadNextTrack: () => void;
  isAudioReady: boolean;
};

const Controls = ({ loadPreviousTrack, loadNextTrack }: Props) => {
  return (
    <nav>
      <button
        onClick={() => loadPreviousTrack()}
        className={styles.changeTrackButton}
      >
        ☜
      </button>

      <button
        onClick={() => loadNextTrack()}
        className={styles.changeTrackButton}
      >
        ☞
      </button>
    </nav>
  );
};

export default Controls;
