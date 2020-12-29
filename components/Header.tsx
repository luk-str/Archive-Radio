import styles from "./Header.module.css";

const Header = () => {
  return (
    <>
      <header className={styles.header__container}>
        <h1 className={styles.header__title}>Archive Radio</h1>
      </header>
    </>
  );
};

export default Header;
