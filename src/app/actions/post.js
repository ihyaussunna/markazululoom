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
  const imageUrl = formData.get('imageUrl');
  const videoUrl = formData.get('videoUrl');
  const categoryId = formData.get('categoryId');
  const authorId = formData.get('authorId');
  const published = formData.get('published') === 'true';

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
