import { useEffect, ReactElement, useState } from "react";
import { getNewAudioTrack } from "../lib/fetchFromArchive";
import Audio from "./Audio";

export default function AudioPlayer(): ReactElement {
  const [audioSourceUrl, setAudioSourceUrl] = useState<string>("");

  useEffect(() => {
    loadNewAudio();
  }, []);

  async function loadNewAudio() {
    const audioSource = await getNewAudioTrack();
    setAudioSourceUrl(audioSource);
  }

  return (
    <div>
      <h2>Title</h2>
      <h3>[Progress bar]</h3>

      <Audio audioSourceUrl={audioSourceUrl} />
      <button onClick={() => loadNewAudio()}>reload</button>
    </div>
  );
}
