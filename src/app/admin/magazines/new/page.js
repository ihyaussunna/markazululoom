'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadMagazine } from '@/app/actions/magazines';
import styles from '../../admin.module.css';
import Link from 'next/link';

export default function NewMagazinePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      const result = await uploadMagazine(formData);

      if (result?.error) {
        setErrorMessage(result.error);
        setSubmitting(false);
      } else {
        setSuccessMessage('Magazine created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/admin/magazines');
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage(err?.message || 'An unexpected error occurred while creating the magazine.');
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1>Create Magazine</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Upload or configure a new issue of Globeats magazine
          </p>
        </div>
        <Link 
          href="/admin/magazines" 
          style={{ 
            color: 'var(--text-secondary)', 
            textDecoration: 'none', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            fontSize: '0.95rem' 
          }}
        >
          ← Back to Magazines
        </Link>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        
        {errorMessage && (
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            color: '#ef4444',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: '6px',
            color: '#10b981',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="title" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Title *</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                placeholder="Magazine issue title" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="slug" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Slug (optional)</label>
              <input 
                type="text" 
                id="slug" 
                name="slug" 
                placeholder="custom-magazine-slug" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="edition" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Edition</label>
              <input 
                type="text" 
                id="edition" 
                name="edition" 
                placeholder="e.g. Vol 1. Issue 4" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="year" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Year</label>
              <input 
                type="number" 
                id="year" 
                name="year" 
                defaultValue={new Date().getFullYear()} 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="language" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Language</label>
              <input 
                type="text" 
                id="language" 
                name="language" 
                defaultValue="Malayalam" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="author" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Author / Editor</label>
              <input 
                type="text" 
                id="author" 
                name="author" 
                placeholder="Editor or Author name" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="publisher" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Publisher</label>
              <input 
                type="text" 
                id="publisher" 
                name="publisher" 
                placeholder="Publisher name" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3} 
              placeholder="Brief summary or description of this magazine issue" 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
            ></textarea>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Media & Content Options</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Provide the magazine cover and content (either a direct PDF link or a list of image page URLs)
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="image" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Cover Image (Upload File)</label>
              <input 
                type="file" 
                id="image" 
                name="image" 
                accept="image/*" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Upload a JPG or PNG cover image</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="coverImageUrl" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Or Cover Image URL</label>
              <input 
                type="url" 
                id="coverImageUrl" 
                name="coverImageUrl" 
                placeholder="https://domain.com/cover.jpg" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Direct public image link (if not uploading a file)</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="pdfLink" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>PDF File Link (Direct URL)</label>
            <input 
              type="url" 
              id="pdfLink" 
              name="pdfLink" 
              placeholder="https://example.com/files/magazine.pdf" 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Direct public link to the PDF file (e.g. from Google Drive, Cloudinary, AWS S3, or Archive.org)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="pageImagesUrlList" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Or Page Images Sequence (One URL per line)</label>
            <textarea 
              id="pageImagesUrlList" 
              name="pageImagesUrlList" 
              rows={4} 
              placeholder={'https://domain.com/page1.jpg\nhttps://domain.com/page2.jpg\nhttps://domain.com/page3.jpg'} 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
            ></textarea>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Used if you prefer pages as sequential images instead of a single PDF file
            </span>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
          <h3>SEO & Meta</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="seoTitle" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>SEO Title</label>
              <input 
                type="text" 
                id="seoTitle" 
                name="seoTitle" 
                placeholder="Custom SEO title for Google" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="tags" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Tags (Comma separated)</label>
              <input 
                type="text" 
                id="tags" 
                name="tags" 
                placeholder="islam, history, culture, saqafa" 
                style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="seoDescription" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>SEO Description</label>
            <textarea 
              id="seoDescription" 
              name="seoDescription" 
              rows={2} 
              placeholder="Meta description for search engines" 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="isFeatured" name="isFeatured" value="true" style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="isFeatured" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Featured Magazine</label>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="status" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Status:</label>
              <select id="status" name="status" defaultValue="PUBLISHED" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              type="submit" 
              disabled={submitting}
              className={styles.primaryBtn}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? (
                <>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                  Creating Magazine...
                </>
              ) : (
                'Create Magazine'
              )}
            </button>
            <Link href="/admin/magazines" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
              Cancel
            </Link>
          </div>

        </form>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
