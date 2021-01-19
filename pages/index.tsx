import Header from "components/Header";
import SiteMetdata from "components/SiteMetadata";
import AudioPlayer from "../components/AudioPlayer";

export default function Home() {
  return (
    <>
      <SiteMetdata />

      <Header />

      <main>
        <AudioPlayer />
      </main>
    </>
  );
}
