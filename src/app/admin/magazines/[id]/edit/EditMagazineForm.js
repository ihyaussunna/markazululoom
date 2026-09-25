'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../admin.module.css';
import Link from 'next/link';
import { compressImage } from '@/lib/imageCompressor';

export default function EditMagazineForm({ magazine, initialPageImagesText }) {
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
      const formEl = e.currentTarget;
      const formData = new FormData(formEl);

      const imageFile = formData.get('image');
      if (imageFile && imageFile.size > 0 && imageFile.type && imageFile.type.startsWith('image/')) {
        if (imageFile.size > 700 * 1024) {
          setSuccessMessage('Optimizing cover image for web...');
        }
        const compressed = await compressImage(imageFile);
        formData.set('image', compressed);
      }

      setSuccessMessage('Saving magazine changes...');

      const res = await fetch('/api/admin/magazines', {
        method: 'PUT',
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        if (res.status === 413) {
          throw new Error('The uploaded file is too large for the server (limit 4.5MB). Please use a smaller image or enter a direct Cover Image URL.');
        }
        throw new Error(`Server returned an error (${res.status}): ${text.slice(0, 100)}`);
      }

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Failed to update magazine.');
        setSuccessMessage('');
        setSubmitting(false);
      } else {
        setSuccessMessage('Magazine updated successfully! Redirecting...');
        setTimeout(() => {
          router.push('/admin/magazines');
          router.refresh();
        }, 800);
      }
    } catch (err) {
      console.error('Edit error:', err);
      setErrorMessage(err?.message || 'An unexpected network error occurred.');
      setSuccessMessage('');
      setSubmitting(false);
    }
  }

  return (
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
        <input type="hidden" name="id" value={magazine.id} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Title *</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              defaultValue={magazine.title} 
              required 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="slug" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Slug</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              defaultValue={magazine.slug || ''} 
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
              defaultValue={magazine.edition || ''} 
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
              defaultValue={magazine.year || new Date().getFullYear()} 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="language" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Language</label>
            <input 
              type="text" 
              id="language" 
              name="language" 
              defaultValue={magazine.language || 'Malayalam'} 
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
              defaultValue={magazine.author || ''} 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="publisher" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Publisher</label>
            <input 
              type="text" 
              id="publisher" 
              name="publisher" 
              defaultValue={magazine.publisher || ''} 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="description" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Description</label>
          <textarea 
            id="description" 
            name="description" 
            defaultValue={magazine.description || ''} 
            rows={3} 
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
          ></textarea>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
        <h3>Media Options</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="image" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Cover Image (Upload new to replace)</label>
            <input 
              type="file" 
              id="image" 
              name="image" 
              accept="image/*" 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
            />
            {magazine.coverImage && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Current Cover: <a href={magazine.coverImage} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>View</a>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="coverImageUrl" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Or Cover Image URL</label>
            <input 
              type="url" 
              id="coverImageUrl" 
              name="coverImageUrl" 
              defaultValue={magazine.coverImage || ''} 
              placeholder="https://domain.com/cover.jpg" 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="pdfLink" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>PDF Link (Direct link to PDF file)</label>
          <input 
            type="url" 
            id="pdfLink" 
            name="pdfLink" 
            defaultValue={magazine.pdfLink || ''} 
            placeholder="https://.../file.pdf" 
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="pageImagesUrlList" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Or Image Sequence URLs (One per line)</label>
          <textarea 
            id="pageImagesUrlList" 
            name="pageImagesUrlList" 
            defaultValue={initialPageImagesText} 
            rows={4} 
            placeholder={'https://domain.com/page1.jpg\nhttps://domain.com/page2.jpg'} 
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
          ></textarea>
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
              defaultValue={magazine.seoTitle || ''} 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="tags" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Tags (Comma separated)</label>
            <input 
              type="text" 
              id="tags" 
              name="tags" 
              defaultValue={magazine.tags || ''} 
              style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="seoDescription" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>SEO Description</label>
          <textarea 
            id="seoDescription" 
            name="seoDescription" 
            defaultValue={magazine.seoDescription || ''} 
            rows={2} 
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="isFeatured" 
              name="isFeatured" 
              defaultChecked={magazine.isFeatured} 
              value="true" 
              style={{ width: '1.2rem', height: '1.2rem' }} 
            />
            <label htmlFor="isFeatured" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Featured Magazine</label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="status" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Status:</label>
            <select 
              id="status" 
              name="status" 
              defaultValue={magazine.status} 
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
            >
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
                Updating Magazine...
              </>
            ) : (
              'Update Magazine'
            )}
          </button>
          <Link href="/admin/magazines" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            Cancel
          </Link>
        </div>

      </form>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
