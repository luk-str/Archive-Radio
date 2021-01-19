import styles from "./Header.module.css";

type Props = {
  shareTrackUrl: string;
};

const Header = ({ shareTrackUrl }: Props) => (
  <header className={styles.container}>
    <a href="/" title="Reload Archive Radio">
      <h1 className={styles.title}>Archive Radio</h1>
    </a>
  </header>
);

export default Header;
