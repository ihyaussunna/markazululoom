import { prisma } from '@/lib/prisma';
import { updateSiteSettings, uploadBanner, deleteBanner, toggleBannerStatus } from '@/app/actions/settings';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const currentTitleFont = settingsMap['titleFont'] || 'fkl-dhikk';
  const currentTextFont = settingsMap['textFont'] || 'anek-malayalam';

  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div>
      <div className={styles.header}>
        <h1>Site Settings</h1>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Global Font Settings</h3>
        <form action={updateSiteSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="titleFont" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Website Title & Heading Font</label>
              <select id="titleFont" name="titleFont" defaultValue={currentTitleFont} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option value="fkl-dhikk">FKL-Dhikk Bold (Local Font)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label htmlFor="textFont" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Post Content Text Font</label>
              <select id="textFont" name="textFont" defaultValue={currentTextFont} style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option value="anek-malayalam">Anek Malayalam</option>
                <option value="manjari">Manjari</option>
                <option value="inter">Inter</option>
                <option value="raleway">Raleway</option>
                <option value="ubuntu">Ubuntu</option>
                <option value="poppins">Poppins</option>
                <option value="montserrat">Montserrat</option>
                <option value="outfit">Outfit</option>
              </select>
            </div>
          </div>

          <div style={{ alignSelf: 'flex-start' }}>
            <button type="submit" className={styles.primaryBtn}>Save Font Settings</button>
          </div>
        </form>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Home Page Banners</h3>
        
        <form action={uploadBanner} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
            <label htmlFor="image" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Upload New Banner Image</label>
            <input type="file" id="image" name="image" accept="image/*" required style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
            <label htmlFor="link" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Banner Link URL (Optional)</label>
            <input type="url" id="link" name="link" placeholder="https://..." style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
          <button type="submit" className={styles.primaryBtn}>Upload Banner</button>
        </form>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image Preview</th>
              <th>Link</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>
                  <img src={banner.imageUrl} alt="Banner" style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{banner.link || 'None'}</td>
                <td>
                  <form action={toggleBannerStatus}>
                    <input type="hidden" name="id" value={banner.id} />
                    <input type="hidden" name="isActive" value={banner.isActive.toString()} />
                    <button type="submit" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', backgroundColor: banner.isActive ? 'var(--primary-color)' : 'var(--border-color)', color: banner.isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {banner.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </form>
                </td>
                <td>
                  <form action={deleteBanner}>
                    <input type="hidden" name="id" value={banner.id} />
                    <button type="submit" className={styles.deleteBtn}>Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No banners uploaded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
