import { prisma } from '@/lib/prisma';
import { createAuthor, deleteAuthor } from '@/app/actions/author';
import styles from '../admin.module.css';
import SubmitButton from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.header}>
        <h1>Authors</h1>
      </div>
      
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Add New Author</h3>
        <form action={createAuthor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="name" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Name</label>
              <input type="text" id="name" name="name" required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="profileImage" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Profile Image (Upload)</label>
              <input type="file" id="profileImage" name="profileImage" accept="image/*" style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="bio" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Bio</label>
            <textarea id="bio" name="bio" rows="3" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>
          <div style={{ alignSelf: 'flex-start' }}>
            <SubmitButton className={styles.primaryBtn} loadingText="Adding...">Add Author</SubmitButton>
          </div>
        </form>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Bio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{author.bio}</td>
              <td>
                <div className={styles.actions}>
                  <form action={deleteAuthor}>
                    <input type="hidden" name="id" value={author.id} />
                    <SubmitButton className={styles.deleteBtn} loadingText="Deleting...">Delete</SubmitButton>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {authors.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No authors found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
