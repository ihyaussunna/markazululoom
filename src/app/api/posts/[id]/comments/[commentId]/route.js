import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { cookies } from 'next/headers';

export async function DELETE(request, { params }) {
  try {
    const { commentId } = params;

    // Check if user is logged in
    const session = await getServerSession(authOptions);
    const authCookie = (await cookies()).get('admin_auth');
    const isAdmin = authCookie?.value === 'authenticated';

    if (!session?.user && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check if the user owns the comment OR is an admin
    if (!isAdmin && comment.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
