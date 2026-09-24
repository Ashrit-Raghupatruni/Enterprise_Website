import prisma from './src/config/prisma.js';
import { ProductController } from './src/features/products/controllers/productController.js';

async function testSubmit() {
  const controller = new ProductController();
  
  const user = await prisma.user.findFirst({ where: { username: 'Ganesh' } }) || await prisma.user.findFirst();
  const product = await prisma.product.findFirst();
  
  console.log("Submitting as user:", user.username, "for product:", product.id);

  const req = {
    params: { id: product.id },
    body: { rating: 3.5, comment: 'Testing 3.5' },
    user: { userId: user.id }
  };

  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      console.log(`Status: ${this.statusCode}`);
      console.log("Response:", JSON.stringify(data, null, 2));
      return this;
    },
    send: function() {
      console.log(`Status: ${this.statusCode}`);
      return this;
    }
  };

  await controller.rateProduct(req, res);
  
  const checkReview = await prisma.review.findFirst({
    where: { userId: user.id, productId: product.id }
  });
  console.log("Saved review in DB:", checkReview);
  
  await prisma.$disconnect();
}
testSubmit();
