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
        <h3>{audioTrack.author}</h3>
      </section>

      <section className={styles.title__container}>
        <h2
          ref={titleElement}
          className={isTextOverflowing ? styles["title--animated"] : ""}
        >
          {audioTrack.title}
        </h2>
      </section>

      <h4>{audioTrack.year}</h4>
    </article>
  );
};

export default Metadata;
