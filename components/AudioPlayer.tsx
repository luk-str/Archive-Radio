import { useState, useEffect, ReactElement, useRef } from "react";
import { getNewAudioTrack } from "../lib/fetchFromArchive";
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

const placeholderImage: string =
  "https://via.placeholder.com/500/111111/eeeeee?text=%E2%99%AA";

export default function AudioPlayer(): ReactElement {
  const [audioTrack, setAudioTrack] = useState<AudioTrack>({});
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);

  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadNewAudio();
    checkAudioSource();
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

    audio.addEventListener("canplay", () => {
      console.log("Audio loaded, ready to play.");
      setIsAudioReady(true);
    });
    audio.addEventListener("error", () => {
      console.log("Audio source failed :(, reloading.");
      loadNewAudio();
    });
    audio.addEventListener("ended", () => {
      console.log("Track ended.");
      loadNewAudio();
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
                <Image
                  src={audioTrack.imageSourceUrl}
                  alt="album art"
                  width={400}
                  height={400}
                  onError={() => {
                    console.log(
                      "Cover image missing, replacing with placeholder."
                    );
                    setAudioTrack({
                      ...audioTrack,
                      imageSourceUrl: placeholderImage,
                    });
                  }}
                />
              </section>

              <button onClick={playPause}>{!isPlaying ? "►" : "∥∥"}</button>

              <button onClick={() => loadNewAudio()}>reload</button>
            </>
          )}
        </>
      ) : (
        <h2>wait a second...</h2>
      )}
    </article>
  );
}
