import Head from "next/head";
import styles from "../styles/Home.module.css";
import AudioPlayer from "../components/AudioPlayer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Archive Radio</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <header>
        <h1>Archive Radio</h1>
      </header>

      <main>
        <AudioPlayer />
      </main>
    </div>
  );
}
