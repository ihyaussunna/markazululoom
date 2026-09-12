import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ThemeToggle from './ThemeToggle';
import NavbarClient from './NavbarClient';
import styles from './Navbar.module.css';

export default async function Navbar() {
  // Ensure SAQAFA category exists automatically
  try {
    const saqafa = await prisma.category.findUnique({ where: { slug: 'saqafa' } });
    if (!saqafa) {
      await prisma.category.create({
        data: { name: 'SAQAFA', slug: 'saqafa' }
      });
    }
  } catch (e) {
    // Ignore concurrency/already exists
  }

  const categories = await prisma.category.findMany({
    take: 30,
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
