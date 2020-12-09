import { useRef, useEffect } from "react";
import { getNewAudioTrack } from "../lib/fetchFromArchive";

export default function AudioPlayer() {
  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadNewAudio();
  }, []);

  async function loadNewAudio() {
    const audioSource = await getNewAudioTrack();
    audioElement.current.src = audioSource;
  }

  const playPause: () => void = () => {
    const audio = audioElement.current;

    if (audio.paused) {
      audio.play();
      console.log("playing");
    } else {
      audio.pause();
      console.log("paused");
    }
  };

  return (
    <div>
      <h2>Title</h2>
      <audio ref={audioElement}></audio>
      <h3>[Progress bar]</h3>
      <button onClick={playPause}>Play/Pause</button>
    </div>
  );
}
