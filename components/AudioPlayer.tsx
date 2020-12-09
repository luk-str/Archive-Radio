import { useRef } from "react";

export default function AudioPlayer() {
  const audioElement = useRef<HTMLAudioElement>(null);

  const playPause: () => void = () => {
    const audio = audioElement.current;

    if (audio.src === "") {
      const testSource: string =
        "https://ia801907.us.archive.org/2/items/lucien-muratore-monella-dufilm-le-chanteur-inconnu-pathe-x-93040/LucienMuratore,Monella,DufilmLeChanteurInconnu,PatheX93040.mp3";

      audio.src = testSource;
    }

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
