import styles from "./Controls.module.css";
import {
  PreviousTrackButtonSVG,
  NextTrackButtonSVG,
  PlayButtonSVG,
  PauseButtonSVG,
} from "./svg/buttons";

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
  isAudioReady,
  isAutoplayOn,
}: Props) => {
  return (
    <nav>
      {isAudioReady && (
        <section>
          <input
            type="checkbox"
            id="autoplay"
            name="autoplay"
            checked={isAutoplayOn}
            onChange={toggleAutoplay}
          />
          <label htmlFor="autoplay" className={styles.checkboxLabel}>
            autoplay
          </label>
        </section>
      )}

      <section className={styles.container}>
        <button
          onClick={() => loadPreviousTrack()}
          className={`${styles.changeTrackButton} ${
            !isAudioReady && styles.inactive
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className={styles.svgButton}
          >
            <PreviousTrackButtonSVG />
          </svg>
        </button>

        <button
          onClick={playPause}
          className={`${styles.changeTrackButton} ${
            !isAudioReady && styles.inactive
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className={styles.svgButton}
          >
            {!isPlaying ? <PlayButtonSVG /> : <PauseButtonSVG />}
          </svg>
        </button>

        <button
          onClick={() => loadNextTrack()}
          className={`${styles.changeTrackButton} ${
            !isAudioReady && styles.inactive
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className={styles.svgButton}
          >
            <NextTrackButtonSVG />
          </svg>
        </button>
      </section>
    </nav>
  );
};

export default Controls;
