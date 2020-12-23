import styles from "./Controls.module.css";

type Props = {
  loadPreviousTrack: () => void;
  loadNextTrack: () => void;
  playPause: () => void;
  toggleAutoplay: () => void;
  isPlaying: boolean;
  isAudioReady: boolean;
  isAutoplayOn: boolean;
};

const Controls = ({
  loadPreviousTrack,
  loadNextTrack,
  playPause,
  toggleAutoplay,
  isPlaying,
  isAutoplayOn,
}: Props) => {
  return (
    <nav>
      <input
        type="checkbox"
        id="autoplay"
        name="autoplay"
        checked={isAutoplayOn}
        onChange={toggleAutoplay}
      />
      <label htmlFor="autoplay" 
      className={styles.checkboxLabel}
      >
        autoplay
      </label>

      <button
        onClick={() => loadPreviousTrack()}
        className={styles.changeTrackButton}
      >
        ☜
      </button>

      <button onClick={playPause} className={styles.changeTrackButton}>
        {!isPlaying ? "►" : "∥∥"}
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
