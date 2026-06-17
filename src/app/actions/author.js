'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAuthor(formData) {
  const name = formData.get('name');
  const bio = formData.get('bio');
  const file = formData.get('profileImage');
  
  let profileImageUrl = null;
  
  if (file && file.size > 0) {
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', file);
    
    const apiKey = process.env.IMGBB_API_KEY || '065aaa8352796b4792cda33d9de4b2eb';
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });
    
    const data = await response.json();
    if (data.success) {
      profileImageUrl = data.data.url;
    } else {
      console.error('ImgBB Upload Error:', data);
    }
  } else {
    // Fallback if they passed a URL instead
    const url = formData.get('profileImageUrl');
    if (url) profileImageUrl = url;
  }

  await prisma.author.create({
    data: { name, bio, profileImageUrl }
  });

  revalidatePath('/admin/authors');
}

export async function deleteAuthor(formData) {
  const id = formData.get('id');
  
  await prisma.author.delete({
    where: { id }
  });

  revalidatePath('/admin/authors');
}
