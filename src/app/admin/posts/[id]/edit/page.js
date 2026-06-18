import { prisma } from '@/lib/prisma';
import { updatePost } from '@/app/actions/post';
import styles from '../../../admin.module.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditPostPage(props) {
  const { id } = await props.params;

  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    notFound();
  }

  const categories = await prisma.category.findMany();
  const authors = await prisma.author.findMany();

  return (
    <div>
      <div className={styles.header}>
        <h1>Edit Post</h1>
        <Link href="/admin/posts" style={{ color: 'var(--text-secondary)' }}>Back to Posts</Link>
      </div>
      
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <form action={updatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="existingImageUrl" value={post.imageUrl || ''} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
            <input type="text" id="title" name="title" defaultValue={post.title} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="categoryId" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
              <select id="categoryId" name="categoryId" defaultValue={post.categoryId} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="authorId" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Author</label>
              <select id="authorId" name="authorId" defaultValue={post.authorId} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option value="">Select Author...</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="image" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Update Thumbnail Image (Optional)</label>
              <input type="file" id="image" name="image" accept="image/*" style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
              {post.imageUrl && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current: <img src={post.imageUrl} style={{ height: '30px', verticalAlign: 'middle' }} alt="Current" /></p>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="videoUrl" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>YouTube/Instagram Video URL</label>
              <input type="url" id="videoUrl" name="videoUrl" defaultValue={post.videoUrl || ''} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="excerpt" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Excerpt (Short Description)</label>
            <textarea id="excerpt" name="excerpt" defaultValue={post.excerpt || ''} rows="2" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="content" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Content (Supports HTML)</label>
            <textarea id="content" name="content" defaultValue={post.content} required rows="10" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="published" name="published" value="true" defaultChecked={post.published} style={{ width: '1.2rem', height: '1.2rem' }} />
            <label htmlFor="published" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Published</label>
          </div>

          <div style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
            <button type="submit" className={styles.primaryBtn}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
