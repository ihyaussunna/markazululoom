import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import FlipbookWrapper from '@/components/FlipbookWrapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const magazine = await prisma.magazine.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!magazine) return { title: 'Not Found' };

  return {
    title: magazine.seoTitle || `${magazine.title} | Globeats Magazines`,
    description: magazine.seoDescription || magazine.description || `Read ${magazine.title} online.`,
    openGraph: {
      images: [magazine.coverImage],
    }
  };
}

export default async function MagazineReaderPage({ params }) {
  try {
    const resolvedParams = await params;
    const magazine = await prisma.magazine.findUnique({
      where: { slug: resolvedParams.slug, isActive: true }
    });

    if (!magazine) {
      notFound();
    }

    const session = await getServerSession(authOptions);
    let startPage = 0;

    if (session?.user?.id) {
      const history = await prisma.magazineHistory.findUnique({
        where: { userId_magazineId: { userId: session.user.id, magazineId: magazine.id } }
      });
      if (history) {
        startPage = history.lastPage;
      }
    }

    const safeMagazine = JSON.parse(JSON.stringify(magazine));

    return (
      <FlipbookWrapper 
        magazine={safeMagazine} 
        userId={session?.user?.id || null} 
        initialPage={startPage} 
      />
    );
  } catch (error) {
    return (
      <div style={{ padding: '2rem', color: 'red', backgroundColor: '#ffebe9', margin: '2rem', borderRadius: '8px' }}>
        <h2>DEBUG: SSR Error Caught</h2>
        <p><strong>Message:</strong> {error.message}</p>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', marginTop: '1rem' }}>{error.stack}</pre>
      </div>
    );
  }
}
