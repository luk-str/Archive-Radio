import styles from "./AudioPlayer.module.css";
import { useState, useEffect, ReactElement, useRef } from "react";
import {
  getAudioTrack,
  fetchRandomItemId,
  fetchMetadata,
} from "../lib/fetchFromArchive";
import Controls from "./Controls";
import Metadata from "./Metadata";
import Progress from "./Progress";
import AlbumArt from "./AlbumArt";
import Head from "next/head";

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

export default function AudioPlayer(): ReactElement {
  const [audioTrack, setAudioTrack] = useState<AudioTrack>({});
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>();
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isAutoplayOn, setIsAutoplayOn] = useState<boolean>(false);
  const [trackMemory, setTrackMemory] = useState<AudioTrack[]>([]);

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

  function loadPreviousTrack(): void {
    const currentTrackMemoryIndex: number = trackMemory.indexOf(audioTrack);
    const previousTrack: AudioTrack = trackMemory[currentTrackMemoryIndex - 1];

    if (currentTrackMemoryIndex === 0) return;

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
      <Head>
        <title>
          {isAudioReady
            ? `${audioTrack.title} | Archive Radio`
            : "Archive Radio"}
        </title>
      </Head>

      <audio
        src={audioTrack.audioSourceUrl}
        ref={audioElement}
        autoPlay={isAutoplayOn}
      ></audio>

      {isAudioReady ? (
        <>
          <Metadata audioTrack={audioTrack} />

          <section className={styles.coverImage__container}>
            <AlbumArt
              imageSourceUrl={audioTrack.imageSourceUrl}
              handleImageError={(imageUrl) =>
                setAudioTrack({
                  ...audioTrack,
                  imageSourceUrl: imageUrl,
                })
              }
            />
          </section>

          <Progress currentPosition={currentPosition} duration={duration} />
        </>
      ) : (
        <section className={styles.loadingTextContainer}>
          <h2 className={styles.loadingText}>Looking for a new song...</h2>
        </section>
      )}

      <Controls
        loadPreviousTrack={loadPreviousTrack}
        loadNextTrack={loadNextTrack}
        playPause={playPause}
        toggleAutoplay={() => setIsAutoplayOn(!isAutoplayOn)}
        isAudioReady={isAudioReady}
        isPlaying={isPlaying}
        isAutoplayOn={isAutoplayOn}
        isThereAPreviousTrack={
          trackMemory.length > 1 && trackMemory.indexOf(audioTrack) > 0
        }
      />
    </article>
  );
}
