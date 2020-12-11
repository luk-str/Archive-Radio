import { useState, useEffect, ReactElement, useRef } from "react";
import { getNewAudioTrack } from "../lib/fetchFromArchive";
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

  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioElement.current;

    loadNewAudio();
    checkAudioSource();

    audio.addEventListener("timeupdate", () => {
      setCurrentPosition(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      loadNewAudio();
    });

    audio.addEventListener("error", () => {
      loadNewAudio();
    });
  }, []);

  async function loadNewAudio() {
    setIsAudioReady(false);
    setIsPlaying(false);
    setAudioTrack({});

    const audioTrack = await getNewAudioTrack();
    setAudioTrack(audioTrack);
  }

  function playPause(): void {
    const audio = audioElement.current;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function checkAudioSource(): void {
    const audio = audioElement.current;

    audio.addEventListener("loadedmetadata", () => {
      setIsAudioReady(true);
      setDuration(audio.duration);
    });
  }

  return (
    <article>
      <audio src={audioTrack.audioSourceUrl} ref={audioElement}></audio>

      {isAudioReady ? (
        <>
          <h3>{audioTrack.author}</h3>
          <h2>{audioTrack.title}</h2>
          <h4>{audioTrack.year}</h4>

          {audioTrack.id && (
            <>
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
                  src={audioTrack.imageSourceUrl}
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

              <button
                onClick={() => loadNewAudio()}
                className={styles.reloadButton}
              >
                next ➮
              </button>
            </>
          )}
        </>
      ) : (
        <section className={styles.loadingTextContainer}>
          <h2 className={styles.loadingText}>Looking for a new song...</h2>
        </section>
      )}
    </article>
  );
}
