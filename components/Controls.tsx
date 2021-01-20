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
  isPlaying: boolean;
  isAudioReady: boolean;
  isFirstTrack: boolean;
  isShareModalOpen: boolean;
};

export default function Controls({
  loadPreviousTrack,
  loadNextTrack,
  playPause,
  isPlaying,
  isAudioReady,
  isFirstTrack,
  isShareModalOpen,
}: Props) {
  return (
    <nav>
      <section className={styles.container}>
        <button
          aria-label="Load previous audio track"
          onClick={() => loadPreviousTrack()}
          className={`${styles.button} ${
            isFirstTrack || !isAudioReady ? styles.inactive : ""
          }`}
          disabled={
            isAudioReady && !isFirstTrack && !isShareModalOpen ? false : true
          }
        >
          <PreviousTrackButtonSVG css={styles.svg} />
        </button>

        <button
          aria-label={!isPlaying ? "Play" : "Pause"}
          onClick={playPause}
          className={`${styles.button} ${!isAudioReady && styles.inactive}`}
          disabled={isAudioReady && !isShareModalOpen ? false : true}
        >
          {!isPlaying ? (
            <PlayButtonSVG css={styles.svg} />
          ) : (
            <PauseButtonSVG css={styles.svg} />
          )}
        </button>

        <button
          aria-label="Load next audio track"
          onClick={() => loadNextTrack()}
          className={`${styles.button} ${!isAudioReady && styles.inactive}`}
          disabled={isAudioReady && !isShareModalOpen ? false : true}
        >
          <NextTrackButtonSVG css={styles.svg} />
        </button>
      </section>
    </nav>
  );
}
