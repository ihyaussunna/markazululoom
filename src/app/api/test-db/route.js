import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const categories = await prisma.category.findMany();
    const authors = await prisma.author.findMany();

    return NextResponse.json({ success: true, posts, categories, authors });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
