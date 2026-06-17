'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createCategory(formData) {
  const name = formData.get('name');
  const slug = formData.get('slug') || generateSlug(name);

  await prisma.category.create({
    data: { name, slug }
  });

  revalidatePath('/admin/categories');
}

export async function deleteCategory(formData) {
  const id = formData.get('id');
  
  await prisma.category.delete({
    where: { id }
  });

  revalidatePath('/admin/categories');
}
