import { useEffect, ReactElement, useState } from "react";
import { getNewAudioTrack } from "../lib/fetchFromArchive";
import Audio from "./Audio";
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
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);

  useEffect(() => {
    loadNewAudio();
  }, []);

  async function loadNewAudio() {
    setIsAudioReady(false);
    setAudioTrack({});

    const audioTrack = await getNewAudioTrack();
    setAudioTrack(audioTrack);
  }

  return (
    <article>
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
                console.log("Cover image missing, replacing with placeholder.");
                setAudioTrack({
                  ...audioTrack,
                  imageSourceUrl: placeholderImage,
                });
              }}
            />
          </section>

          <Audio
            audioSourceUrl={audioTrack.audioSourceUrl}
            loadNewAudio={loadNewAudio}
            audioIsReady={() => setIsAudioReady(true)}
          />

          <button onClick={() => loadNewAudio()}>reload</button>
        </>
      )}
    </article>
  );
}
