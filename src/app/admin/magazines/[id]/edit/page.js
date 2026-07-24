import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { editMagazine } from '@/app/actions/magazines';
import SubmitButton from '@/components/SubmitButton';
import styles from '../../../admin.module.css';

export default async function EditMagazinePage({ params }) {
  const magazine = await prisma.magazine.findUnique({
    where: { id: params.id }
  });

  if (!magazine) {
    notFound();
  }

  let pageImagesText = '';
  try {
    if (magazine.pageImages) {
      pageImagesText = JSON.parse(magazine.pageImages).join('\n');
    }
  } catch (e) {}

  return (
    <div>
      <div className={styles.header}>
        <h1>Edit Magazine</h1>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <form action={editMagazine} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <input type="hidden" name="id" value={magazine.id} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="title" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Title *</label>
              <input type="text" id="title" name="title" defaultValue={magazine.title} required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="slug" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Slug</label>
              <input type="text" id="slug" name="slug" defaultValue={magazine.slug} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="edition" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Edition</label>
              <input type="text" id="edition" name="edition" defaultValue={magazine.edition} placeholder="e.g. Vol 1. Issue 4" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="year" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Year</label>
              <input type="number" id="year" name="year" defaultValue={magazine.year} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="language" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Language</label>
              <input type="text" id="language" name="language" defaultValue={magazine.language} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="author" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Author / Editor</label>
              <input type="text" id="author" name="author" defaultValue={magazine.author} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="publisher" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Publisher</label>
              <input type="text" id="publisher" name="publisher" defaultValue={magazine.publisher} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Description</label>
            <textarea id="description" name="description" defaultValue={magazine.description} rows="3" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
          <h3>Media Options</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="image" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Cover Image (Upload new to replace)</label>
              <input type="file" id="image" name="image" accept="image/*" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
              {magazine.coverImage && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Current Cover: <a href={magazine.coverImage} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>View</a>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="pdfLink" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>PDF Link (Direct link to PDF file)</label>
              <input type="url" id="pdfLink" name="pdfLink" defaultValue={magazine.pdfLink} placeholder="https://.../file.pdf" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="pageImagesUrlList" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Or Image Sequence URLs (One per line)</label>
            <textarea id="pageImagesUrlList" name="pageImagesUrlList" defaultValue={pageImagesText} rows="4" placeholder="https://domain.com/page1.jpg&#10;https://domain.com/page2.jpg" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
          <h3>SEO & Meta</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="seoTitle" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>SEO Title</label>
              <input type="text" id="seoTitle" name="seoTitle" defaultValue={magazine.seoTitle} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="tags" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Tags (Comma separated)</label>
              <input type="text" id="tags" name="tags" defaultValue={magazine.tags} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="seoDescription" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>SEO Description</label>
            <textarea id="seoDescription" name="seoDescription" defaultValue={magazine.seoDescription} rows="2" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={magazine.isFeatured} value="true" style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="isFeatured" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Featured Magazine</label>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="status" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Status:</label>
              <select id="status" name="status" defaultValue={magazine.status} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <SubmitButton className={styles.primaryBtn} loadingText="Saving..." successText="Updated Successfully!">
              Update Magazine
            </SubmitButton>
          </div>

        </form>
      </div>
    </div>
  );
}
