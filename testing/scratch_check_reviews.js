import prisma from './src/config/prisma.js';

async function check() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' }
  });
  console.log("All reviews in DB:", reviews);
  await prisma.$disconnect();
}
check();
