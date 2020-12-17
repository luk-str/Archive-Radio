import styles from "./AudioPlayer.module.css";
import { useState, useEffect, ReactElement, useRef } from "react";
import Image from "next/image";
import {
  getAudioTrack,
  fetchRandomItemId,
  fetchMetadata,
} from "../lib/fetchFromArchive";
import { convertSecondsToMinSec } from "../lib/convertMetadata";

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
  const [trackMemory, setTrackMemory] = useState<AudioTrack[]>([]); // TODO: Change memory from storing id's to storing whole metadata objects to skip fetching metadata every time

  const audioElement = useRef<HTMLAudioElement>(null);

  // Initialize player on first load

  useEffect(() => {
    const audio = audioElement.current;

    loadRandomAudioTrack();

    audio.ondurationchange = () => {
      setDuration(audio.duration);
      setIsAudioReady(true);
    };

    audio.ontimeupdate = () => setCurrentPosition(audio.currentTime);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => loadRandomAudioTrack();
    audio.onerror = () => loadRandomAudioTrack();
  }, []);

  // Update track memory when audio is valid and ready to play
  useEffect(() => {
    // Only run when isAudioReady updates to true
    if (isAudioReady) {
      let currentMemory = trackMemory.filter(Boolean);

      // Only add new track to memory if it isn't already in the memory
      if (!trackMemory.includes(audioTrack)) {
        setTrackMemory([...currentMemory, audioTrack]);
      }
    }
  }, [isAudioReady]);

  // TRACK LOADING

  function loadNextTrack(): void {
    // Check the index of current audio before resetting
    const currentTrackMemoryIndex: number = trackMemory.indexOf(audioTrack);

    // Load new random track if current track is the last in the memory
    if (currentTrackMemoryIndex === trackMemory.length - 1) {
      loadRandomAudioTrack();
    } else {
      // Otherwise load the next track from memory
      resetPlayer();
      const nextTrack = trackMemory[currentTrackMemoryIndex + 1];

      setAudioTrack(nextTrack);
    }
  }

  async function loadPreviousTrack(): Promise<void> {
    const currentTrackMemoryIndex: number = trackMemory.indexOf(audioTrack);
    const previousTrack: AudioTrack = trackMemory[currentTrackMemoryIndex - 1];

    resetPlayer();

    setAudioTrack(previousTrack);
  }

  async function loadRandomAudioTrack(): Promise<void> {
    resetPlayer();

    const id = await fetchRandomItemId();
    const itemMetadata = await fetchMetadata(id);

    const audioTrack = getAudioTrack(itemMetadata);

    setAudioTrack(audioTrack);
  }

  // Controlling the Audio Player

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

  // RENDER

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
            checked={isAutoplayOn}
            onChange={() => setIsAutoplayOn(!isAutoplayOn)}
          />
          <label htmlFor="autoplay" className={styles.checkboxLabel}>
            autoplay
          </label>

          <nav>
            {/* Only display "previous" button when there's more than 1 element in memory & current Track isn't the first in memory */}
            {trackMemory.length > 1 && trackMemory.indexOf(audioTrack) > 0 && (
              <button
                onClick={() => loadPreviousTrack()}
                className={styles.changeTrackButton}
              >
                ☜
              </button>
            )}

            <button
              onClick={() => loadNextTrack()}
              className={styles.changeTrackButton}
            >
              ☞
            </button>
          </nav>
        </>
      ) : (
        <section className={styles.loadingTextContainer}>
          <h2 className={styles.loadingText}>Looking for a new song...</h2>
        </section>
      )}
    </article>
  );
}
