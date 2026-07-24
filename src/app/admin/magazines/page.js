import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { uploadMagazine, deleteMagazine, toggleMagazineStatus } from '@/app/actions/magazines';
import styles from '../../admin.module.css';
import SubmitButton from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export default async function AdminMagazinesPage() {
  const magazines = await prisma.magazine.findMany({
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.header}>
        <h1>Magazines</h1>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Upload New Magazine</h3>
        <form action={uploadMagazine} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="title" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
              <input type="text" id="title" name="title" required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="image" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Thumbnail Image (Upload)</label>
              <input type="file" id="image" name="image" accept="image/*" required style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="pdfLink" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>PDF Link (Google Drive / external)</label>
              <input type="url" id="pdfLink" name="pdfLink" required placeholder="https://drive.google.com/..." style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description (Optional)</label>
            <textarea id="description" name="description" rows="2" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
            <SubmitButton className={styles.primaryBtn} loadingText="Uploading...">Upload Magazine</SubmitButton>
          </div>
        </form>
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
