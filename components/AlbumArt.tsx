import { ChangeEvent, useState } from "react";
import Image from "next/image";
import styles from "./AlbumArt.module.css";

type Props = {
  imageSourceUrl: string;
};

export default function AlbumArt({ imageSourceUrl }: Props) {
  const [imageSource, setImageSource] = useState<string>(imageSourceUrl);
  const [isImageReady, setIsImageReady] = useState<boolean>(false);

  const placeholderImagePath = "/img/cover-fallback.png";

  function handleOnLoad(e: ChangeEvent<HTMLImageElement>) {
    if (e.target.srcset) {
      setIsImageReady(true);
    }
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
        onError={() => setImageSource(placeholderImagePath)}
        className={isImageReady ? styles.visible : styles.hidden}
      />
    </>
  );
}
