import { useRef, useState, useEffect, ReactElement } from "react";

type Props = {
  audioSourceUrl: string;
  loadNewAudio: () => void;
  audioIsReady: () => void;
};

export default function Audio(props: Props): ReactElement {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    checkAudioSource();
  }, []);

  function checkAudioSource(): void {
    const audio = audioElement.current;

    audio.addEventListener("canplay", () => {
      console.log("Audio loaded, ready to play.");
      props.audioIsReady();
    });
    audio.addEventListener("error", () => {
      console.log("Audio source failed :(, reloading.");
      props.loadNewAudio();
    });
    audio.addEventListener("ended", () => {
      console.log("Track ended.");
      props.loadNewAudio();
    });
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

  return (
    <>
      <audio src={props.audioSourceUrl} ref={audioElement}></audio>
      <button onClick={playPause}>{!isPlaying ? "►" : "∥∥"}</button>
    </>
  );
}
