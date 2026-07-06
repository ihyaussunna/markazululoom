import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { action } = await request.json(); // 'like' or 'dislike'

    if (!['like', 'dislike'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        [action === 'like' ? 'likes' : 'dislikes']: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      likes: updatedPost.likes,
      dislikes: updatedPost.dislikes
    });
  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json({ error: 'Failed to update reaction' }, { status: 500 });
  }
}
