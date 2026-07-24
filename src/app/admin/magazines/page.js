import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteMagazine, toggleMagazineStatus } from '@/app/actions/magazines';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminMagazinesPage() {
  const magazines = await prisma.magazine.findMany({
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.header}>
        <h1>Magazines Dashboard</h1>
        <Link href="/admin/magazines/new" className={styles.primaryBtn}>
          Create Magazine
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Magazines</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{magazines.length}</span>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Published</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{magazines.filter(m => m.status === 'PUBLISHED').length}</span>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Drafts</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{magazines.filter(m => m.status === 'DRAFT').length}</span>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Archived</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6b7280' }}>{magazines.filter(m => m.status === 'ARCHIVED').length}</span>
        </div>
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Magazine Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {magazines.map((mag) => (
              <tr key={mag.id}>
                <td>
                  <img src={mag.coverImage || '/placeholder-cover.jpg'} alt={mag.title} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{mag.title}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {mag.edition && `${mag.edition} • `}{mag.year} {mag.isFeatured && <span style={{ padding: '2px 6px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '4px', fontSize: '0.7rem', marginLeft: '0.5rem' }}>Featured</span>}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>
                      /{mag.slug}
                    </span>
                  </div>
                </td>
                <td>
                  <form action={toggleMagazineStatus}>
                    <input type="hidden" name="id" value={mag.id} />
                    <input type="hidden" name="isActive" value={(mag.status === 'PUBLISHED').toString()} />
                    <button type="submit" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', backgroundColor: mag.status === 'PUBLISHED' ? 'var(--primary-color)' : mag.status === 'ARCHIVED' ? '#6b7280' : '#f59e0b', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {mag.status}
                    </button>
                  </form>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/admin/magazines/${mag.id}/edit`} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.8rem', textDecoration: 'none' }}>
                      Edit
                    </Link>
                    <form action={deleteMagazine}>
                      <input type="hidden" name="id" value={mag.id} />
                      <button type="submit" className={styles.deleteBtn}>Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {magazines.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No magazines found. Create one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
