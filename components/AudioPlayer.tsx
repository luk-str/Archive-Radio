import { useState, useEffect, ReactElement, useRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Head from "next/head";
import styles from "./AudioPlayer.module.css";
import type { AudioTrack } from "../lib/types";
import {
  getAudioTrack,
  fetchRandomItemId,
  fetchMetadata,
} from "../lib/fetchFromArchive";
import Controls from "./Controls";
import Metadata from "./Metadata";
import Progress from "./Progress";
import AlbumArt from "./AlbumArt";

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
      fadeInAudio();
    };

    audio.ontimeupdate = () => setCurrentPosition(audio.currentTime);
    audio.onplay = () => {
      setIsPlaying(true);
      setIsAutoplayOn(true);
    };
    audio.onpause = () => {
      setIsPlaying(false);
      setIsAutoplayOn(false);
    };
    audio.onended = () => {
      resetPlayer();
      setIsAutoplayOn(true);
      loadRandomAudioTrack();
    };
    audio.onerror = () => {
      resetPlayer();
      loadRandomAudioTrack();
    };
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
    const isLastTrackInMemory: boolean =
      currentTrackMemoryIndex === trackMemory.length - 1;

    // Load new random track if current track is the last in the memory
    if (isLastTrackInMemory || currentTrackMemoryIndex < 0) {
      resetPlayer();
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
    const id = await fetchRandomItemId();
    const itemMetadata = await fetchMetadata(id);

    const audioTrack = getAudioTrack(itemMetadata);

    setAudioTrack(audioTrack);
  }

  // Controlling the Audio Player

  function resetPlayer(): void {
    fadeOutAudio();
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

  function fadeOutAudio(): void {
    const audio = audioElement.current;

    const fade = setInterval(() => {
      if (audio.volume > 0) {
        // The value has to be rounded each time to avoid weird calculation errors with funky decimals
        audio.volume = +(audio.volume - 0.1).toFixed(2);
      } else {
        clearInterval(fade);
      }
    }, 30);
  }

  function fadeInAudio(): void {
    const audio = audioElement.current;

    const fade = setInterval(() => {
      if (audio.volume < 1) {
        // The value has to be rounded each time to avoid weird calculation errors with funky decimals
        audio.volume = +(audio.volume + 0.1).toFixed(2);
      } else {
        clearInterval(fade);
      }
    }, 100);
  }

  // RENDER

  return (
    <>
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

      <TransitionGroup>
        {isAudioReady ? (
          <CSSTransition
            in={isAudioReady}
            appear={true}
            key={audioTrack.id}
            timeout={1500}
            classNames={{ ...styles }}
          >
            <article className={styles.player__container}>
              <Metadata audioTrack={audioTrack} />

              <section className={styles.coverImage__container}>
                <AlbumArt imageSourceUrl={audioTrack.imageSourceUrl} />
              </section>

              <Progress currentPosition={currentPosition} duration={duration} />
            </article>
          </CSSTransition>
        ) : (
          <CSSTransition
            in={isAudioReady}
            appear={true}
            key={"loader"}
            timeout={1500}
            classNames={{ ...styles }}
          >
            <section className={styles.loadingTextContainer}>
              <h2 className={styles.loadingText}>Looking for a new song...</h2>
            </section>
          </CSSTransition>
        )}
      </TransitionGroup>

      <Controls
        loadPreviousTrack={loadPreviousTrack}
        loadNextTrack={loadNextTrack}
        playPause={playPause}
        isAudioReady={isAudioReady}
        isPlaying={isPlaying}
        isThereAPreviousTrack={
          trackMemory.length > 1 && trackMemory.indexOf(audioTrack) > 0
        }
      />
    </>
  );
}
