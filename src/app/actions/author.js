'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAuthor(formData) {
  const name = formData.get('name');
  const bio = formData.get('bio');
  const file = formData.get('profileImage');
  
  let profileImageUrl = null;
  
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // We dynamically import fs and path to avoid issues
    const fs = require('fs/promises');
    const path = require('path');
    
    const ext = path.extname(file.name) || '.jpg';
    const filename = `author-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'authors');
    
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    
    profileImageUrl = `/uploads/authors/${filename}`;
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
