import Head from "next/head";
import Header from "components/Header";
import AudioPlayer from "../components/AudioPlayer";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Archive radio lets you discover music from the amazing open collections of Internet Archive. Press play, sit back and enjoy."
        />
        <meta name="author" content="https://luk-str.dev" />

        {/* Open Graph Data */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="Archive Radio" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Archive radio lets you discover music from the amazing open collections of Internet Archive. Press play, sit back and enjoy."
        />
        <meta
          property="og:image"
          content="https://radio-archive.vercel.app/img/project_preview.jpg"
        />
        <meta
          property="og:image:alt"
          content="Preview of the Radio Archive audio player"
        />

        {/* Favicon */}
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
        <link rel="manifest" href="favicon/site.webmanifest" />
      </Head>

      <Header />

      <main>
        <AudioPlayer />
      </main>
    </>
  );
}
