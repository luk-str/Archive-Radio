import Image from "next/image";
import styles from "./AudioPlayer.module.css";

const placeholderImagePath: string = "/img/cover-fallback.png";

type Props = {
  imageSourceUrl: string;
  handleImageError: (imageUrl: string) => void;
};

const AlbumArt = ({ imageSourceUrl, handleImageError }: Props) => {
  return (
    <>
      <Image
        className={styles.coverImage__albumImage}
        src={imageSourceUrl || placeholderImagePath}
        alt="album art"
        layout="fill"
        loading={"lazy"}
        onError={() => {
          handleImageError(placeholderImagePath);
        }}
      />
    </>
  );
};

export default AlbumArt;
