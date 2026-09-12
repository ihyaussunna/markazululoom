import { prisma } from '@/lib/prisma';
import { createPost } from '@/app/actions/post';
import styles from '../../admin.module.css';
import Link from 'next/link';
import AuthorSelector from '@/components/AuthorSelector';
import CategorySelector from '@/components/CategorySelector';
import { getCategories } from '@/lib/categories';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const categories = await getCategories();
  const authors = await prisma.author.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <div className={styles.header}>
        <h1>Create New Post</h1>
        <Link href="/admin/posts" style={{ color: 'var(--text-secondary)' }}>Back to Posts</Link>
      </div>
      
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <form action={createPost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
            <input type="text" id="title" name="title" dir="auto" required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <CategorySelector initialCategories={categories} />
            <AuthorSelector initialAuthors={authors} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="image" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Thumbnail Image (Optional)</label>
              <input type="file" id="image" name="image" accept="image/*" style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="videoUrl" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>YouTube/Instagram Video URL</label>
              <input type="url" id="videoUrl" name="videoUrl" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="excerpt" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Excerpt (Short Description)</label>
            <textarea id="excerpt" name="excerpt" dir="auto" rows="2" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="content" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Content (Supports HTML & Arabic Text)</label>
            <textarea id="content" name="content" dir="auto" required rows="10" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="published" name="published" value="true" defaultChecked={true} style={{ width: '1.2rem', height: '1.2rem' }} />
            <label htmlFor="published" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Published</label>
          </div>

          <div style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
            <button type="submit" className={styles.primaryBtn}>Create Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}
