import { FunctionComponent, useRef, useState } from "react";

type Props = {
  audioSourceUrl: string;
};

const Audio: FunctionComponent<Props> = ({ audioSourceUrl }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioElement = useRef<HTMLAudioElement>(null);

  const playPause: () => void = () => {
    const audio = audioElement.current;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio src={audioSourceUrl} ref={audioElement}></audio>
      <button onClick={playPause}>{!isPlaying ? "PLAY" : "PAUSE"}</button>
    </>
  );
};

export default Audio;
