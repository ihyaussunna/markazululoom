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
          <h1>THINK</h1>
          <span className={styles.tagline}>Readers are Thinkers</span>
        </Link>
        <NavbarClient categories={categories} />
      </div>
    </header>
  );
}
