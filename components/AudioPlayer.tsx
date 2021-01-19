import { useState, useEffect, ReactElement, useRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "./AudioPlayer.module.css";
import type { AudioTrack } from "../lib/types";
import {
  createAudioTrackObject,
  getRandomItemId,
  getItemMetadata,
} from "../lib/fetchFromArchive";
import Header from "./Header";
import Controls from "./Controls";
import TrackMetadata from "./TrackMetadata";
import Progress from "./Progress";
import AlbumArt from "./AlbumArt";

export default function AudioPlayer(): ReactElement {
  const [audioTrack, setAudioTrack] = useState<AudioTrack>({});
  const [duration, setDuration] = useState<number>();
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [trackMemory, setTrackMemory] = useState<AudioTrack[]>([]);
  const [shareTrackUrl, setShareTrackUrl] = useState<string>();

  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState<boolean>(false);

  const audioElement = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  // Runs Once on Component Mount
  useEffect(() => {
    const audio = audioElement.current;

    // Add Player Event Handlers
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
    audio.ondurationchange = () => {
      setDuration(audio.duration);
      setIsAudioReady(true);
      fadeInAudio(audioElement.current);
    };
    audio.ontimeupdate = () => setCurrentPosition(audio.currentTime);
  }, []);

  // Load track once router has loaded its parameters
  useEffect(() => {
    if (router.isReady) {
      const trackId = router.query.trackid as string;
      // Load specific track if there's track ID in the url, else load random.
      if (trackId) {
        loadAudioTrack(trackId);
      } else {
        loadRandomAudioTrack();
      }
    }
  }, [router.isReady]);

  // Runs when audio is ready to play
  useEffect(() => {
    if (isAudioReady) {
      // Set url for sharing a link to specific track using track identifier
      setShareTrackUrl(
        encodeURI(`${window.location.origin}?trackid=${audioTrack.id}`)
      );

      // Save track to memory if it's not already present
      if (!trackMemory.includes(audioTrack)) {
        setTrackMemory([...trackMemory, audioTrack]);
      }
    }
  }, [isAudioReady]);

  // Loads the next track from memory or a new random one if there's none
  function loadNextTrack(): void {
    const currentTrackMemoryIndex = trackMemory.indexOf(audioTrack);
    const isLastTrackInMemory =
      currentTrackMemoryIndex === trackMemory.length - 1;

    resetPlayer();
    if (isLastTrackInMemory) {
      loadRandomAudioTrack();
    } else {
      setAudioTrack(trackMemory[currentTrackMemoryIndex + 1]);
    }
  }

  // Loads previous track from memory if there is one
  function loadPreviousTrack(): void {
    const currentTrackMemoryIndex = trackMemory.indexOf(audioTrack);

    if (currentTrackMemoryIndex <= 0) {
      return;
    } else {
      resetPlayer();
      setAudioTrack(trackMemory[currentTrackMemoryIndex - 1]);
    }
  }

  // Fetches and loads a specific audio track based on provided track id
  async function loadAudioTrack(id: string): Promise<void> {
    const itemMetadata = await getItemMetadata(id);
    const audioTrack = createAudioTrackObject(itemMetadata);

    setAudioTrack(audioTrack);
  }

  // Fetches and loads a new random audio track from Internet Archive
  async function loadRandomAudioTrack(): Promise<void> {
    const id = await getRandomItemId();
    const itemMetadata = await getItemMetadata(id);
    const audioTrack = createAudioTrackObject(itemMetadata);

    setAudioTrack(audioTrack);
  }

  // Clears out audio source and resets audio status states
  function resetPlayer(): void {
    fadeOutAudio(audioElement.current);
    setIsPlaying(false);
    setIsAudioReady(false);
    setAudioTrack({});
  }

  function playPause(audio: HTMLAudioElement): void {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  // Fades out audio volume (Has no effect on iOS devices as they don't allow volume control)
  function fadeOutAudio(audio: HTMLAudioElement): void {
    const fadeOut = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume = +(audio.volume - 0.1).toFixed(2); // Value has to be rounded to avoid calculation errors with funky decimals
      } else {
        clearInterval(fadeOut);
      }
    }, 30);
  }

  // Fades in audio volume (Has no effect on iOS devices as they don't allow volume control)
  function fadeInAudio(audio: HTMLAudioElement): void {
    const fadeIn = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = +(audio.volume + 0.1).toFixed(2); // Value has to be rounded to avoid calculation errors with funky decimals
      } else {
        clearInterval(fadeIn);
      }
    }, 100);
  }

  return (
    <>
      <Head>
        <title>
          {isAudioReady
            ? `${audioTrack.title} | Archive Radio`
            : "Archive Radio"}
        </title>
      </Head>

      <Header shareTrackUrl={shareTrackUrl} isAudioReady={isAudioReady} />

      <main>
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
                <TrackMetadata audioTrack={audioTrack} />

                <section className={styles.coverImage__container}>
                  <AlbumArt imageSourceUrl={audioTrack.imageSourceUrl} />
                </section>

                <Progress
                  currentPosition={currentPosition}
                  duration={duration}
                />
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
              <section className={styles.loadingText__container}>
                <h2 className={styles.loadingText}>
                  Looking for a new song...
                </h2>
              </section>
            </CSSTransition>
          )}
        </TransitionGroup>
      </main>

      <Controls
        loadPreviousTrack={loadPreviousTrack}
        loadNextTrack={loadNextTrack}
        playPause={() => playPause(audioElement.current)}
        isAudioReady={isAudioReady}
        isPlaying={isPlaying}
        isFirstTrack={trackMemory.indexOf(audioTrack) === 0}
      />
    </>
  );
}
