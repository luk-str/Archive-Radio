export function convertSecondsToMinSec(value: number): string {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  const secondsPadded = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${minutes}:${secondsPadded}`;
}
