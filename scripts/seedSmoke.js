// Simple seed script for Prisma Example model
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.example.upsert({
    where: { slug: 'smoke-test' },
    update: { name: 'Smoke Test Example' },
    create: { name: 'Smoke Test Example', slug: 'smoke-test' },
  });
  console.log('Seed complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
