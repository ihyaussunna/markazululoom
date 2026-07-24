import Link from 'next/link';
import { logout } from '@/app/actions/auth';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="Globeats" style={{ height: '36px', width: 'auto' }} className={styles.logoLight} />
              <img src="/logo-white.png" alt="Globeats" style={{ height: '36px', width: 'auto' }} className={styles.logoDark} />
            </div>
          </Link>
          <p style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Admin Panel</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/posts" className={styles.sidebarLink}>All Posts</Link>
          <Link href="/admin/posts/new" className={styles.sidebarLink}>New Post</Link>
          <Link href="/admin/categories" className={styles.sidebarLink}>Categories</Link>
          <Link href="/admin/authors" className={styles.sidebarLink}>Authors</Link>
          <Link href="/admin/magazines" className={styles.sidebarLink}>Magazines</Link>
          <Link href="/admin/settings" className={styles.sidebarLink}>Settings</Link>
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
