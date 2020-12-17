import { useState, useEffect, ReactElement, useRef } from "react";
import {
  getAudioTrack,
  fetchRandomItemId,
  fetchMetadata,
} from "../lib/fetchFromArchive";
import { convertSecondsToMinSec } from "../lib/convertMetadata";
import styles from "./AudioPlayer.module.css";
import Image from "next/image";

type AudioTrack = {
  id?: string;
  title?: string;
  year?: string;
  author?: string;
  description?: string;
  audioSourceUrl?: string;
  imageSourceUrl?: string;
  archivePageUrl?: string;
};

const placeholderImage: string = "/img/cover-fallback.png";

export default function AudioPlayer(): ReactElement {
  const [audioTrack, setAudioTrack] = useState<AudioTrack>({});
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>();
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isAutoplayOn, setIsAutoplayOn] = useState<boolean>(false);

  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioElement.current;

    loadRandomAudioTrack();

    audio.addEventListener("durationchange", () => {
      setDuration(audio.duration);
      setIsAudioReady(true);
    });

    audio.addEventListener("timeupdate", () =>
      setCurrentPosition(audio.currentTime)
    );

    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => loadRandomAudioTrack());
    audio.addEventListener("error", () => loadRandomAudioTrack());
  }, []);

  async function loadRandomAudioTrack(): Promise<void> {
    resetPlayer();

    const id = await fetchRandomItemId();
    const itemMetadata = await fetchMetadata(id);

    const audioTrack = getAudioTrack(itemMetadata);

    setAudioTrack(audioTrack);
  }

  function resetPlayer(): void {
    audioElement.current.pause();
    setIsPlaying(false);
    setIsAudioReady(false);
    setAudioTrack({});
  }

  function playPause(): void {
    const audio = audioElement.current;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  return (
    <article>
      <audio
        src={audioTrack.audioSourceUrl}
        ref={audioElement}
        autoPlay={isAutoplayOn}
      ></audio>

      {isAudioReady ? (
        <>
          <h3>{audioTrack.author}</h3>
          <h2>{audioTrack.title}</h2>
          <h4>{audioTrack.year}</h4>

          <section className={styles.coverImage__container}>
            <button
              onClick={playPause}
              className={`${styles.playButton} ${
                !isPlaying && styles.playButton_paused
              }`}
            >
              {!isPlaying ? "►" : "∥∥"}
            </button>

            <Image
              src={audioTrack.imageSourceUrl || placeholderImage}
              alt="album art"
              layout="fill"
              onError={() => {
                setAudioTrack({
                  ...audioTrack,
                  imageSourceUrl: placeholderImage,
                });
              }}
            />
          </section>
          <h5>
            {`${convertSecondsToMinSec(
              currentPosition
            )} / ${convertSecondsToMinSec(duration)}`}
          </h5>

          <input
            type="checkbox"
            id="autoplay"
            name="autoplay"
            value="autoplay"
            checked={isAutoplayOn}
            onChange={() => setIsAutoplayOn(!isAutoplayOn)}
          />
          <label htmlFor="autoplay" className={styles.checkboxLabel}>
            autoplay
          </label>

          <button
            onClick={() => loadRandomAudioTrack()}
            className={styles.reloadButton}
          >
            next ➮
          </button>
        </>
      ) : (
        <section className={styles.loadingTextContainer}>
          <h2 className={styles.loadingText}>Looking for a new song...</h2>
        </section>
      )}
    </article>
  );
}
