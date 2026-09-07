import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, authors });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    
    // Check admin authentication session
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, profileImageUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Author name is required' }, { status: 400 });
    }

    const newAuthor = await prisma.author.create({
      data: {
        name: name.trim(),
        bio: bio?.trim() || null,
        profileImageUrl: profileImageUrl?.trim() || null,
      }
    });

    return NextResponse.json({ 
      success: true, 
      author: newAuthor 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json({ error: 'Failed to create author' }, { status: 500 });
  }
}
