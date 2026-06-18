import { prisma } from '@/lib/prisma';
import { createPost, deletePost, togglePostStatus } from '@/app/actions/post';
import Link from 'next/link';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  try {
    const posts = await prisma.post.findMany({
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' }
    });

    const categories = await prisma.category.findMany();
    const authors = await prisma.author.findMany();

    return (
      <div>
        <div className={styles.header}>
          <h1>Posts</h1>
        </div>
        
        <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Post</h3>
          <form action={createPost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="title" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
              <input type="text" id="title" name="title" required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                <label htmlFor="categoryId" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
                <select id="categoryId" name="categoryId" required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                  <option value="">Select Category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                <label htmlFor="authorId" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Author</label>
                <select id="authorId" name="authorId" required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                  <option value="">Select Author...</option>
                  {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                <label htmlFor="image" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Thumbnail Image (Upload)</label>
                <input type="file" id="image" name="image" accept="image/*" style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                <label htmlFor="videoUrl" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>YouTube/Instagram Video URL</label>
                <input type="url" id="videoUrl" name="videoUrl" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="excerpt" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Excerpt (Short Description)</label>
              <textarea id="excerpt" name="excerpt" rows="2" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="content" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Content (Supports HTML)</label>
              <textarea id="content" name="content" required rows="10" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="published" name="published" value="true" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="published" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Publish Immediately</label>
            </div>

            <div style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
              <button type="submit" className={styles.primaryBtn}>Publish Post</button>
            </div>
          </form>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</td>
                <td>{post.category?.name || 'Uncategorized'}</td>
                <td>{post.author?.name || 'Unknown Author'}</td>
                <td>{post.published ? 'Published' : 'Draft'}</td>
                <td>
                  <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem' }}>
                    <form action={togglePostStatus}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="published" value={post.published.toString()} />
                      <button type="submit" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', backgroundColor: post.published ? '#10b981' : '#6b7280', color: 'white', fontSize: '0.8rem' }}>
                        {post.published ? 'Make Private' : 'Make Public'}
                      </button>
                    </form>
                    <Link href={`/admin/posts/${post.id}/edit`} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '0.8rem', textDecoration: 'none' }}>
                      Edit
                    </Link>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <button type="submit" className={styles.deleteBtn}>Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No posts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>Server Error Caught in PostsPage</h1>
        <pre style={{ backgroundColor: '#111', padding: '1rem', overflow: 'auto', color: 'pink' }}>{error.message}</pre>
        <pre style={{ backgroundColor: '#111', padding: '1rem', overflow: 'auto', color: 'orange' }}>{error.stack}</pre>
      </div>
    );
  }
}
