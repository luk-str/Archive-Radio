import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Archive Radio</title>
      </Head>

      <main className={styles.main}>
        <p>Archive Radio</p>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
