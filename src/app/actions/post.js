'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
}

export async function createPost(formData) {
  const title = formData.get('title');
  const slug = generateSlug(title);
  const content = formData.get('content');
  const excerpt = formData.get('excerpt');
  const videoUrl = formData.get('videoUrl');
  const categoryId = formData.get('categoryId');
  const authorId = formData.get('authorId');
  const published = formData.get('published') === 'true';

  const file = formData.get('image');
  let imageUrl = null;
  
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fs = require('fs/promises');
    const path = require('path');
    
    const ext = path.extname(file.name) || '.jpg';
    const filename = `post-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'posts');
    
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    
    imageUrl = `/uploads/posts/${filename}`;
  } else {
    const url = formData.get('imageUrl');
    if (url) imageUrl = url;
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      videoUrl,
      categoryId,
      authorId,
      published
    }
  });

  revalidatePath('/admin/posts');
  revalidatePath('/');
}

export async function deletePost(formData) {
  const id = formData.get('id');
  
  await prisma.post.delete({
    where: { id }
  });

  revalidatePath('/admin/posts');
  revalidatePath('/');
}
