import Image from "next/image";

const placeholderImagePath: string = "/img/cover-fallback.png";

type Props = {
  imageSourceUrl: string;
  handleImageError: (imageUrl: string) => void;
};

const AlbumArt = ({ imageSourceUrl, handleImageError }: Props) => {
  return (
    <>
      <Image
        src={imageSourceUrl || placeholderImagePath}
        alt="album art"
        layout="fill"
        onError={() => {
          handleImageError(placeholderImagePath);
        }}
      />
    </>
  );
};

export default AlbumArt;
