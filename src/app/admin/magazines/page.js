import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteMagazine, toggleMagazineStatus } from '@/app/actions/magazines';
import styles from '../../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminMagazinesPage() {
  const magazines = await prisma.magazine.findMany({
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.header}>
        <h1>Magazines</h1>
        <Link href="/admin/magazines/new" className={styles.primaryBtn}>
          Upload New Magazine
        </Link>
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>PDF Link</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {magazines.map((mag) => (
              <tr key={mag.id}>
                <td>
                  <img src={mag.coverImage} alt={mag.title} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ fontWeight: '600' }}>{mag.title}</td>
                <td>
                  {mag.pdfLink ? (
                    <a href={mag.pdfLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>View PDF</a>
                  ) : 'No Link'}
                </td>
                <td>
                  <form action={toggleMagazineStatus}>
                    <input type="hidden" name="id" value={mag.id} />
                    <input type="hidden" name="isActive" value={mag.isActive.toString()} />
                    <button type="submit" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', backgroundColor: mag.isActive ? 'var(--primary-color)' : 'var(--border-color)', color: mag.isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {mag.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </form>
                </td>
                <td>
                  <form action={deleteMagazine}>
                    <input type="hidden" name="id" value={mag.id} />
                    <button type="submit" className={styles.deleteBtn}>Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {magazines.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No magazines uploaded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
