import { convertSecondsToMinSec } from "../lib/convertMetadata";

type Props = {
  currentPosition: number;
  duration: number;
};

const Progress = ({ currentPosition, duration }: Props) => {
  return (
    <>
      <h5>
        {`${convertSecondsToMinSec(currentPosition)} / ${convertSecondsToMinSec(
          duration
        )}`}
      </h5>
    </>
  );
};

export default Progress;
