import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
const FlipbookViewer = dynamic(() => import('@/components/FlipbookViewer'), { ssr: false });
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function generateMetadata({ params }) {
  const magazine = await prisma.magazine.findUnique({
    where: { slug: params.slug }
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
  const magazine = await prisma.magazine.findUnique({
    where: { slug: params.slug, isActive: true }
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

  // We pass the startPage to the viewer if needed, though for now the viewer starts at 0.
  // We can pass userId to allow saving progress.

  return (
    <FlipbookViewer 
      magazine={magazine} 
      userId={session?.user?.id} 
      initialPage={startPage} 
    />
  );
}
