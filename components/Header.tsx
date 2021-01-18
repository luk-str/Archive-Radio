import styles from "./Header.module.css";

const Header = () => (
  <header className={styles.container}>
    <a href="/" title="Reload Archive Radio">
      <h1 className={styles.title}>Archive Radio</h1>
    </a>
  </header>
);

export default Header;
