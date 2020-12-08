import Head from "next/head";
import styles from "../styles/Home.module.css";
import AudioPlayer from "../components/AudioPlayer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Archive Radio</title>
      </Head>

      <header>
        <h1>Archive Radio</h1>
      </header>

      <main className={styles.main}>
        <AudioPlayer />
      </main>
    </div>
  );
}
