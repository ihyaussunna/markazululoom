import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ThemeToggle from './ThemeToggle';
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
        <nav className={styles.navLinks}>
          <Link href="/">HOME</Link>
          {categories.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              {cat.name.toUpperCase()}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
