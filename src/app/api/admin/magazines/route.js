import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

function generateSlug(title) {
  if (!title) return 'magazine-' + Date.now();
  const clean = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\u0D00-\u0D7F]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return (clean || 'magazine') + '-' + Date.now();
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    
    // Verify admin authentication
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized: Please log in again.' }, { status: 401 });
    }

    const formData = await request.formData();

    const title = formData.get('title');
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Magazine Title is required.' }, { status: 400 });
    }

    const slugInput = formData.get('slug');
    const slug = (slugInput && slugInput.trim()) ? slugInput.trim() : generateSlug(title);
    const description = formData.get('description') || '';
    const pdfLink = formData.get('pdfLink') || '';
    const file = formData.get('image');
    
    const edition = formData.get('edition') || '';
    const year = parseInt(formData.get('year')) || new Date().getFullYear();
    const author = formData.get('author') || '';
    const publisher = formData.get('publisher') || '';
    const language = formData.get('language') || 'Malayalam';
    const seoTitle = formData.get('seoTitle') || '';
    const seoDescription = formData.get('seoDescription') || '';
    const tags = formData.get('tags') || '';
    const status = formData.get('status') || 'PUBLISHED';
    const isFeatured = formData.get('isFeatured') === 'true';

    let coverImage = formData.get('coverImageUrl') || '';

    // Handle cover image upload to ImgBB if a file was provided
    if (file && typeof file === 'object' && file.size > 0) {
      try {
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', file);

        const apiKey = process.env.IMGBB_API_KEY || '065aaa8352796b4792cda33d9de4b2eb';
        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: imgbbFormData,
        });

        const imgbbData = await imgbbResponse.json();
        if (imgbbData?.success && imgbbData?.data?.url) {
          coverImage = imgbbData.data.url;
        } else {
          console.error('ImgBB upload error:', imgbbData);
        }
      } catch (uploadErr) {
        console.error('ImgBB network upload error:', uploadErr);
      }
    }

    coverImage = coverImage || '/placeholder-cover.jpg';

    const pageImagesStr = formData.get('pageImagesUrlList') || '';
    const pageImages = pageImagesStr ? JSON.stringify(pageImagesStr.split('\n').map(u => u.trim()).filter(Boolean)) : null;

    const newMagazine = await prisma.magazine.create({
      data: {
        title: title.trim(),
        slug,
        description,
        pdfLink: pdfLink.trim(),
        coverImage,
        edition: edition.trim(),
        year,
        author: author.trim(),
        publisher: publisher.trim(),
        language: language.trim(),
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        tags: tags.trim(),
        status,
        isFeatured,
        pageImages,
        isActive: status === 'PUBLISHED'
      }
    });

    try {
      revalidatePath('/magazines');
      revalidatePath('/admin/magazines');
      revalidatePath('/');
    } catch (e) {
      // Ignore cache revalidation errors
    }

    return NextResponse.json({
      success: true,
      magazine: newMagazine,
      message: 'Magazine created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating magazine:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create magazine due to a server error.' 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    
    // Verify admin authentication
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized: Please log in again.' }, { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Magazine ID is required.' }, { status: 400 });
    }

    const title = formData.get('title');
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Magazine Title is required.' }, { status: 400 });
    }

    const slugInput = formData.get('slug');
    const slug = (slugInput && slugInput.trim()) ? slugInput.trim() : generateSlug(title);
    const description = formData.get('description') || '';
    const pdfLink = formData.get('pdfLink') || '';
    const file = formData.get('image');
    
    const edition = formData.get('edition') || '';
    const yearStr = formData.get('year');
    const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();
    const author = formData.get('author') || '';
    const publisher = formData.get('publisher') || '';
    const language = formData.get('language') || 'Malayalam';
    const seoTitle = formData.get('seoTitle') || '';
    const seoDescription = formData.get('seoDescription') || '';
    const tags = formData.get('tags') || '';
    const status = formData.get('status') || 'PUBLISHED';
    const isFeatured = formData.get('isFeatured') === 'true';

    let coverImage = formData.get('coverImageUrl') || undefined;

    if (file && typeof file === 'object' && file.size > 0) {
      try {
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', file);

        const apiKey = process.env.IMGBB_API_KEY || '065aaa8352796b4792cda33d9de4b2eb';
        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: imgbbFormData,
        });

        const imgbbData = await imgbbResponse.json();
        if (imgbbData?.success && imgbbData?.data?.url) {
          coverImage = imgbbData.data.url;
        }
      } catch (uploadErr) {
        console.error('ImgBB network upload error:', uploadErr);
      }
    }

    const pageImagesStr = formData.get('pageImagesUrlList') || '';
    const pageImages = pageImagesStr ? JSON.stringify(pageImagesStr.split('\n').map(u => u.trim()).filter(Boolean)) : null;

    const dataToUpdate = {
      title: title.trim(),
      slug,
      description,
      pdfLink: pdfLink.trim(),
      edition: edition.trim(),
      year,
      author: author.trim(),
      publisher: publisher.trim(),
      language: language.trim(),
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      tags: tags.trim(),
      status,
      isFeatured,
      pageImages,
      isActive: status === 'PUBLISHED'
    };
    if (coverImage) {
      dataToUpdate.coverImage = coverImage;
    }

    const updated = await prisma.magazine.update({
      where: { id },
      data: dataToUpdate
    });

    try {
      revalidatePath('/magazines');
      revalidatePath('/admin/magazines');
      revalidatePath('/');
    } catch (e) {
      // Ignore cache revalidation errors
    }

    return NextResponse.json({
      success: true,
      magazine: updated,
      message: 'Magazine updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating magazine:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update magazine.' 
    }, { status: 500 });
  }
}
