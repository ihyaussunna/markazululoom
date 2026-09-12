import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getCategories } from '@/lib/categories';

export const dynamic = 'force-dynamic';

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\u0D00-\u0D7F]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    
    // Verify admin authentication
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug: providedSlug } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const cleanSlug = (providedSlug?.trim() || generateSlug(trimmedName)) || `cat-${Date.now()}`;

    // Check if category or slug already exists
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: cleanSlug },
          { name: { equals: trimmedName, mode: 'insensitive' } }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        category: existing,
        message: 'Category already exists' 
      }, { status: 200 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: trimmedName,
        slug: cleanSlug,
      }
    });

    try {
      revalidatePath('/admin/categories');
      revalidatePath('/admin/posts/new');
      revalidatePath('/admin/posts');
      revalidatePath('/');
    } catch (e) {
      // Ignore cache revalidation errors
    }

    return NextResponse.json({ 
      success: true, 
      category: newCategory 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}
