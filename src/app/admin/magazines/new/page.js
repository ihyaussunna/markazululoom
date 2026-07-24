import { uploadMagazine } from '@/app/actions/magazines';
import SubmitButton from '@/components/SubmitButton';
import styles from '../../admin.module.css';

export default function NewMagazinePage() {
  return (
    <div>
      <div className={styles.header}>
        <h1>Upload New Magazine</h1>
      </div>

      <div style={{ maxWidth: '600px', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <form action={uploadMagazine} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontWeight: 'bold' }}>Title</label>
            <input type="text" id="title" name="title" required placeholder="Magazine Issue Name" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ fontWeight: 'bold' }}>Description / Highlights (Optional)</label>
            <textarea id="description" name="description" rows="3" placeholder="Brief description of this issue..." style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="image" style={{ fontWeight: 'bold' }}>Cover Image</label>
            <input type="file" id="image" name="image" accept="image/*" required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="pdfLink" style={{ fontWeight: 'bold' }}>PDF Link (Google Drive / external)</label>
            <input type="url" id="pdfLink" name="pdfLink" placeholder="https://drive.google.com/..." required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            <small style={{ color: 'var(--text-secondary)' }}>Upload your magazine PDF to Google Drive, make it public, and paste the link here.</small>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <SubmitButton className={styles.primaryBtn} loadingText="Uploading..." successText="Uploaded Successfully!">
              Upload Magazine
            </SubmitButton>
          </div>

        </form>
      </div>
    </div>
  );
}
