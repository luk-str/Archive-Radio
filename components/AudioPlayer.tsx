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
import Header from "./Header/Header";
import Controls from "./Controls";
import TrackMetadata from "./Main/TrackMetadata";
import Progress from "./Main/Progress";
import AlbumArt from "./Main/AlbumArt";
import ShareModal from "./Header/ShareModal";
import InfoModal from "./Header/InfoModal";

export default function AudioPlayer(): ReactElement {
  const [audioTrack, setAudioTrack] = useState<AudioTrack>({});
  const [duration, setDuration] = useState<number>();
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [trackMemory, _setTrackMemory] = useState<AudioTrack[]>([]);
  const [shareTrackUrl, setShareTrackUrl] = useState<string>();

  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  const audioElement = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const trackMemoryRef = useRef(trackMemory);

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
        setTrackMemory([...trackMemoryRef.current, audioTrack]);
      }

      // Add keyboard controls
      document.addEventListener("keydown", handleKeyPress);
    }

    // Remove event listener on state change
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isAudioReady]);

  // Handle keyboard controls
  function handleKeyPress(event: KeyboardEvent): void {
    switch (event.code) {
      case "Space":
        playPause(audioElement.current);
        break;
      case "ArrowRight":
        loadNextTrack();
        break;
      case "ArrowLeft":
        loadPreviousTrack();
        break;
    }
  }

  function setTrackMemory(newValue: AudioTrack[]) {
    trackMemoryRef.current = newValue;
    _setTrackMemory(newValue);
  }

  // Loads the next track from memory or a new random one if there's none
  function loadNextTrack(): void {
    const currentTrackMemoryIndex = trackMemoryRef.current.indexOf(audioTrack);
    const isLastTrackInMemory =
      currentTrackMemoryIndex === trackMemoryRef.current.length - 1;

    resetPlayer();
    if (isLastTrackInMemory) {
      loadRandomAudioTrack();
    } else {
      setAudioTrack(trackMemoryRef.current[currentTrackMemoryIndex + 1]);
    }
  }

  // Loads previous track from memory if there is one
  function loadPreviousTrack(): void {
    const currentTrackMemoryIndex = trackMemoryRef.current.indexOf(audioTrack);

    if (currentTrackMemoryIndex <= 0) {
      return;
    } else {
      resetPlayer();
      setAudioTrack(trackMemoryRef.current[currentTrackMemoryIndex - 1]);
    }
  }

  // Fetches and loads a specific audio track based on provided track id
  async function loadAudioTrack(id: string): Promise<void> {
    const itemMetadata = await getItemMetadata(id);

    if (itemMetadata.metadata) {
      const audioTrack = createAudioTrackObject(itemMetadata);

      setAudioTrack(audioTrack);
    } else {
      loadRandomAudioTrack();
    }
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

      {isShareModalOpen && (
        <ShareModal
          shareTrackUrl={shareTrackUrl}
          closeShareModal={() => setIsShareModalOpen(false)}
        />
      )}

      {isInfoModalOpen && (
        <InfoModal
          audioTrack={audioTrack}
          closeInfoModal={() => setIsInfoModalOpen(false)}
        />
      )}

      <Header
        isAudioReady={isAudioReady}
        openShareModal={() => setIsShareModalOpen(true)}
        isShareModalOpen={isShareModalOpen}
        openInfoModal={() => setIsInfoModalOpen(true)}
        isInfoModalOpen={isInfoModalOpen}
      />

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
        isShareModalOpen={isShareModalOpen}
      />
    </>
  );
}
