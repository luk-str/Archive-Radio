import { useEffect, useRef, useState } from "react";
import styles from "./Metadata.module.css";

type Props = {
  audioTrack: {
    title?: string;
    year?: string;
    author?: string;
    description?: string;
  };
};

const Metadata = ({ audioTrack }: Props) => {
  const [isTextOverflowing, setIsTextOverflowing] = useState<boolean>(false);

  const titleElement = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
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
            isTextOverflowing ? styles["title--animated"] : ""
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
};

export default Metadata;
