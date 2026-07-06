import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { authorName, content } = await request.json();

    if (!authorName || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const newComment = await prisma.comment.create({
      data: {
        authorName,
        content,
        postId: id
      }
    });

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
