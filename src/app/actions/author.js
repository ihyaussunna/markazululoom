'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAuthor(formData) {
  const name = formData.get('name');
  const bio = formData.get('bio');
  const profileImageUrl = formData.get('profileImageUrl');

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
