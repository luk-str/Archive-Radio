import { convertSecondsToMinSec } from "../lib/convertMetadata";
import styles from "./Progress.module.css";

type Props = {
  currentPosition: number;
  duration: number;
};

const Progress = ({ currentPosition, duration }: Props) => (
  <h5 className={styles.progress}>
    {`${convertSecondsToMinSec(currentPosition)} 
    / ${convertSecondsToMinSec(duration)}`}
  </h5>
);

export default Progress;
