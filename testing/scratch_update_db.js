import prisma from './src/config/prisma.js';

async function update() {
  await prisma.review.update({
    where: { id: 'cmue5s2fn0001t8e5a2m5x3ck' },
    data: { rating: 3.5 }
  });
  console.log("Updated to 3.5");
  await prisma.$disconnect();
}
update();
