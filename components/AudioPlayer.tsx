import { useEffect, ReactElement, useState } from "react";
import { getNewAudioTrack } from "../lib/fetchFromArchive";
import Audio from "./Audio";
import styles from "./AudioPlayer.module.css";

type AudioTrack = {
  id?: string;
  title?: string;
  year?: string;
  description?: string;
  audioSourceUrl?: string;
  imageSourceUrl?: string;
  archivePageUrl?: string;
};

export default function AudioPlayer(): ReactElement {
  const [audioTrack, setAudioTrack] = useState<AudioTrack>({});

  useEffect(() => {
    loadNewAudio();
  }, []);

  async function loadNewAudio() {
    setAudioTrack({});
    const audioTrack = await getNewAudioTrack();
    setAudioTrack(audioTrack);
  }

  return (
    <div>
      <h2>{audioTrack.title}</h2>
      <h3>{audioTrack.year}</h3>

      {audioTrack.imageSourceUrl && (
        <img
          src={audioTrack.imageSourceUrl}
          width="200"
          height="200"
          className={styles.coverImage}
        />
      )}
      {audioTrack.id !== undefined && (
        <>
          <Audio audioSourceUrl={audioTrack.audioSourceUrl} />

          <button onClick={() => loadNewAudio()}>reload</button>
        </>
      )}
    </div>
  );
}
