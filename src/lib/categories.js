import { prisma } from '@/lib/prisma';

export async function getCategories() {
  try {
    let categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' }
    });

    // Ensure SAQAFA exists in the database
    const hasSaqafa = categories.some(
      (c) => c.slug?.toLowerCase() === 'saqafa' || c.name?.toUpperCase() === 'SAQAFA'
    );

    if (!hasSaqafa) {
      try {
        const createdSaqafa = await prisma.category.create({
          data: { name: 'SAQAFA', slug: 'saqafa' }
        });
        categories.push(createdSaqafa);
      } catch (err) {
        // In case of concurrency/race condition, re-fetch
        categories = await prisma.category.findMany({
          orderBy: { createdAt: 'asc' }
        });
      }
    }

    return categories;
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
}
