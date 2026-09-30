import prisma from './src/config/prisma.js';

async function check() {
  const reviews = await prisma.review.findMany();
  console.log("All reviews in DB:", reviews);
  
  const product = await prisma.product.findFirst();
  console.log("Product average:", product.rating);
  
  await prisma.$disconnect();
}
check();
