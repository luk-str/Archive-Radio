import { useEffect, useRef, useState } from "react";
import styles from "./TrackMetadata.module.css";
import type { AudioTrack } from "../lib/types";

type Props = {
  audioTrack: AudioTrack;
};

export default function TrackMetadata({ audioTrack }: Props) {
  const [isTextOverflowing, setIsTextOverflowing] = useState<boolean>(false);

  const titleElement = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Check if title is longer than it's container
    const title = titleElement.current;
    if (title.scrollWidth > title.clientWidth) setIsTextOverflowing(true);
  }, []);

  return (
    <article className={styles.metadata__container}>
      <section className={styles.author__container}>
        <h3 className={styles.author}>{audioTrack.author}</h3>
      </section>

      <section className={styles.title__container}>
        <h2
          ref={titleElement}
          className={`${styles.title} ${
            // Add animation to title if it's longer than container
            isTextOverflowing && styles["title--animated"]
          }`}
        >
          {audioTrack.title}
        </h2>
      </section>

      <section className={styles.year__container}>
        <h4 className={styles.year}>{audioTrack.year}</h4>
      </section>
    </article>
  );
}
