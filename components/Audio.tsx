import {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  ReactElement,
} from "react";

type Props = {
  audioSourceUrl: string;
  loadNewAudio: () => void;
  audioIsReady: () => void;
};

export default function Audio({
  audioSourceUrl,
  loadNewAudio,
  audioIsReady,
}): ReactElement<Props> {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    checkAudioSource();
  }, []);

  function checkAudioSource(): void {
    const audio = audioElement.current;

    audio.addEventListener("canplay", () => {
      console.log("Audio loaded, ready to play.");
      audioIsReady();
    });
    audio.addEventListener("error", () => {
      console.log("Audio source failed :(, reloading.");
      loadNewAudio();
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
      <audio src={audioSourceUrl} ref={audioElement}></audio>
      <button onClick={playPause}>{!isPlaying ? "►" : "∥∥"}</button>
    </>
  );
}
