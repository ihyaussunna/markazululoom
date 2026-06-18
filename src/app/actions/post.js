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
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', file);
    
    const apiKey = process.env.IMGBB_API_KEY || '065aaa8352796b4792cda33d9de4b2eb';
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });
    
    const data = await response.json();
    if (data.success) {
      imageUrl = data.data.url;
    } else {
      console.error('ImgBB Upload Error:', data);
    }
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

export async function togglePostStatus(formData) {
  const id = formData.get('id');
  const published = formData.get('published') === 'true';
  
  await prisma.post.update({
    where: { id },
    data: { published: !published }
  });

  revalidatePath('/admin/posts');
  revalidatePath('/');
}

export async function updatePost(formData) {
  const id = formData.get('id');
  const title = formData.get('title');
  const content = formData.get('content');
  const excerpt = formData.get('excerpt');
  const videoUrl = formData.get('videoUrl');
  const categoryId = formData.get('categoryId');
  const authorId = formData.get('authorId');
  const published = formData.get('published') === 'true';

  const file = formData.get('image');
  let imageUrl = formData.get('existingImageUrl');
  
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
      imageUrl = data.data.url;
    }
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
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
  revalidatePath('/post/[slug]', 'page');
}
