import Link from 'next/link';
import { logout } from '@/app/actions/auth';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>Markazul Uloom</h2>
          <p>Admin Panel</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/posts">Posts</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/authors">Authors</Link>
          <Link href="/" target="_blank">View Site</Link>
        </nav>
        <form action={logout} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutBtn}>Logout</button>
        </form>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
