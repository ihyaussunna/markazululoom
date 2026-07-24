'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
}

export async function uploadMagazine(formData) {
  const title = formData.get('title');
  const slugInput = formData.get('slug');
  const slug = slugInput ? slugInput : generateSlug(title);
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

  if (!title) return { error: 'Title is required' };

  let coverImage = formData.get('coverImageUrl') || '';

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64Image);
    const apiKey = process.env.IMGBB_API_KEY || '065aaa8352796b4792cda33d9de4b2eb';
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: imgbbFormData });
      const data = await response.json();
      if (data.success) {
        coverImage = data.data.url;
      }
    } catch (e) {
      console.error(e);
    }
  }

  const pageImagesStr = formData.get('pageImagesUrlList') || '';
  const pageImages = pageImagesStr ? JSON.stringify(pageImagesStr.split('\\n').map(u => u.trim()).filter(Boolean)) : null;

  try {
    await prisma.magazine.create({
      data: {
        title, slug, description, pdfLink, coverImage, edition, year, author, publisher, language,
        seoTitle, seoDescription, tags, status, isFeatured, pageImages, isActive: status === 'PUBLISHED'
      }
    });

    revalidatePath('/magazines');
    revalidatePath('/admin/magazines');
    return { success: true };
  } catch (error) {
    console.error("Magazine upload error:", error);
    return { error: 'Something went wrong while uploading' };
  }
}

export async function deleteMagazine(formData) {
  const id = formData.get('id');
  if (!id) return;
  await prisma.magazine.delete({ where: { id } });
  revalidatePath('/magazines');
  revalidatePath('/admin/magazines');
}

export async function toggleMagazineStatus(formData) {
  const id = formData.get('id');
  const isActive = formData.get('isActive') === 'true';
  if (!id) return;
  await prisma.magazine.update({
    where: { id },
    data: { 
      isActive: !isActive,
      status: !isActive ? 'PUBLISHED' : 'DRAFT'
    }
  });
  revalidatePath('/magazines');
  revalidatePath('/admin/magazines');
}

export async function saveReadingHistory(userId, magazineId, pageNumber) {
  if (!userId || !magazineId) return;
  await prisma.magazineHistory.upsert({
    where: { userId_magazineId: { userId, magazineId } },
    update: { lastPage: pageNumber },
    create: { userId, magazineId, lastPage: pageNumber }
  });
}
