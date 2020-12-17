export function convertSecondsToMinSec(value: number): string {
  const minutes: number = Math.floor(value / 60);
  const seconds: number = Math.floor(value % 60);

  const secondsPadded: string = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${minutes}:${secondsPadded}`;
}
