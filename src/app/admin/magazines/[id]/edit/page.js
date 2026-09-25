import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from '../../../admin.module.css';
import Link from 'next/link';
import EditMagazineForm from './EditMagazineForm';

export const dynamic = 'force-dynamic';

export default async function EditMagazinePage({ params }) {
  const resolvedParams = await params;
  const magazine = await prisma.magazine.findUnique({
    where: { id: resolvedParams.id }
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

  const safeMagazine = JSON.parse(JSON.stringify(magazine));

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1>Edit Magazine</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Update magazine issue details and media
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

      <EditMagazineForm magazine={safeMagazine} initialPageImagesText={pageImagesText} />
    </div>
  );
}
