'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function uploadMagazine(formData) {
  const title = formData.get('title');
  const description = formData.get('description') || '';
  const pdfLink = formData.get('pdfLink') || '';
  const file = formData.get('image');
  
  if (!title) return { error: 'Title is required' };
  if (!file || file.size === 0) return { error: 'No cover image provided' };

  // Convert File to base64
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64Image = buffer.toString('base64');

  const imgbbFormData = new FormData();
  imgbbFormData.append('image', base64Image);
  
  const apiKey = process.env.IMGBB_API_KEY || '065aaa8352796b4792cda33d9de4b2eb';
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });
    
    const data = await response.json();
    if (data.success) {
      const coverImage = data.data.url;
      
      await prisma.magazine.create({
        data: {
          title,
          description,
          pdfLink,
          coverImage,
          isActive: true
        }
      });

      revalidatePath('/magazines');
      revalidatePath('/admin/magazines');
      return { success: true };
    } else {
      return { error: 'Cover upload failed' };
    }
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
    data: { isActive: !isActive }
  });
  revalidatePath('/magazines');
  revalidatePath('/admin/magazines');
}
