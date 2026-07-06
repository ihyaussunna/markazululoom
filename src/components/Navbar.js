import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ThemeToggle from './ThemeToggle';
import NavbarClient from './NavbarClient';
import styles from './Navbar.module.css';

export default async function Navbar() {
  const categories = await prisma.category.findMany({
    take: 8,
    orderBy: { createdAt: 'asc' }
  });

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <img className={styles.logoImageLight} src="/logo.png" alt="Globeats" />
            <img className={styles.logoImageDark} src="/logo-white.png" alt="Globeats" />
          </div>
        </Link>
        <NavbarClient categories={categories} />
      </div>
    </header>
  );
}
