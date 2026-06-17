import { prisma } from '@/lib/prisma';
import { createCategory, deleteCategory } from '@/app/actions/category';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.header}>
        <h1>Categories</h1>
      </div>
      
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Add New Category</h3>
        <form action={createCategory} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
            <label htmlFor="name" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category Name</label>
            <input type="text" id="name" name="name" required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
            <label htmlFor="slug" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Slug (Optional)</label>
            <input type="text" id="slug" name="slug" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
          <button type="submit" className={styles.primaryBtn}>Add Category</button>
        </form>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.slug}</td>
              <td>
                <div className={styles.actions}>
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={cat.id} />
                    <button type="submit" className={styles.deleteBtn}>Delete</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No categories found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
