type Props = {
  audioTrack: {
    title?: string;
    year?: string;
    author?: string;
    description?: string;
  };
};

const Metadata = ({ audioTrack }: Props) => {
  return (
    <>
      <h3>{audioTrack.author}</h3>
      <h2>{audioTrack.title}</h2>
      <h4>{audioTrack.year}</h4>
    </>
  );
};

export default Metadata;
