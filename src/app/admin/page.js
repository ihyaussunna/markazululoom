import { prisma } from '@/lib/prisma';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const postCount = await prisma.post.count();
  const categoryCount = await prisma.category.count();
  const authorCount = await prisma.author.count();

  return (
    <div>
      <div className={styles.header}>
        <h1>Dashboard</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className={styles.table} style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Total Posts</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{postCount}</p>
        </div>
        <div className={styles.table} style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Categories</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{categoryCount}</p>
        </div>
        <div className={styles.table} style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Authors</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{authorCount}</p>
        </div>
      </div>
    </div>
  );
}
