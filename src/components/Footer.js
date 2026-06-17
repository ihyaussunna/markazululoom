import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brand}>
          <h2>Markazul Uloom</h2>
          <p>The ultimate destination for Malayalam blogs, essays, and literature.</p>
        </div>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Markazul Uloom. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
