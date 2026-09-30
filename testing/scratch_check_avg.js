import prisma from './src/config/prisma.js';

async function checkAvg() {
  const productId = 'cmue51vwx0003wce2bhb00vyg';
  
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  console.log("Product rating in DB:", product.rating);
  
  const aggregations = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true }
  });
  console.log("Review exact average:", aggregations._avg.rating);
  console.log("Review count:", aggregations._count.rating);
  
  await prisma.$disconnect();
}
checkAvg();
