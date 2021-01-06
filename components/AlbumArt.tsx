import Image from "next/image";
import { ChangeEvent, useState } from "react";
import styles from "./AlbumArt.module.css";

const placeholderImagePath: string = "/img/cover-fallback.png";

type Props = {
  imageSourceUrl: string;
};

const AlbumArt = ({ imageSourceUrl }: Props) => {
  const [imageSource, setImageSource] = useState<string>(imageSourceUrl);
  const [isImageReady, setIsImageReady] = useState<boolean>(false);

  function handleOnLoad(e: ChangeEvent<HTMLImageElement>) {
    if (e.target.srcset) {
      setIsImageReady(true);
    }
  }

  function handleOnError() {
    setImageSource(placeholderImagePath);
  }

  return (
    <>
      <Image
        src={imageSource}
        alt="album art"
        layout="responsive"
        width="200"
        height="200"
        onLoad={handleOnLoad}
        onError={handleOnError}
        className={isImageReady ? styles.visible : styles.hidden}
      />
    </>
  );
};

export default AlbumArt;
