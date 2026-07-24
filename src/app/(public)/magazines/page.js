import { prisma } from '@/lib/prisma';
import styles from './magazines.module.css';

export const metadata = {
  title: 'Magazines | Globeats',
  description: 'Read the latest issues of Markazul Uloom magazines.',
};

export const dynamic = 'force-dynamic';

export default async function MagazinesPage() {
  const magazines = await prisma.magazine.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Markazul Uloom</h1>
        <p className={styles.subtitle}>
          Explore our exclusive collection of magazines and literary works. Scroll through the latest issues and read them online.
        </p>
      </div>

      {magazines.length > 0 ? (
        <div className={styles.carousel}>
          {magazines.map((mag) => (
            <a key={mag.id} href={mag.pdfLink} target="_blank" rel="noreferrer" className={styles.magazineCard}>
              <div className={styles.coverContainer}>
                <img src={mag.coverImage} alt={mag.title} className={styles.coverImage} />
              </div>
              <div className={styles.info}>
                <h2 className={styles.magazineTitle}>{mag.title}</h2>
                <div className={styles.date}>
                  {new Date(mag.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
                {mag.description && (
                  <p className={styles.description}>{mag.description}</p>
                )}
                <span className={styles.readBtn}>Read Magazine</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          No magazines are currently available. Please check back later!
        </div>
      )}
    </div>
  );
}
