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
          <div className={styles.animatedLogoContainer}>
            <img className={`${styles.logoImage} ${styles.logoMl}`} src="/logo-ml.svg" alt="Markazul Uloom" />
            <img className={`${styles.logoImage} ${styles.logoEn}`} src="/logo-en.svg" alt="Markazul Uloom" />
          </div>
        </Link>
        <NavbarClient categories={categories} />
      </div>
    </header>
  );
}
