import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const authCookie = (await cookies()).get('admin_auth');
    if (authCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      include: {
        post: {
          select: { title: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching admin comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
