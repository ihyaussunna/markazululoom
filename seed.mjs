import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

async function main() {
  const categories = [
    'IN VOGUE',
    'RESEARCH',
    'ESSAYS',
    'LITERATURE',
    'INTERVIEWS',
    'FAITH & THOUGHT',
    'ARCHIVES'
  ];

  for (const name of categories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug }
    });
  }

  // Also create a dummy author
  await prisma.author.upsert({
    where: { id: 'admin' },
    update: {},
    create: {
      id: 'admin',
      name: 'Markazul Uloom Admin',
      bio: 'Administrator of Markazul Uloom platform.',
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
