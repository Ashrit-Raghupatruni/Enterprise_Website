import prisma from "../../../config/prisma.js";

export class ProductRepository {
  async findAll() {
    return await prisma.product.findMany({
      include: {
        productImages: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByCategory(categoryName) {
    return await prisma.product.findMany({
      where: {
        category: {
          name: {
            equals: categoryName,
            mode: "insensitive",
          },
        },
      },
      include: {
        productImages: true,
        category: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findByIdOrSlug(identifier) {
    return await prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier },
        ],
      },
      include: {
        productImages: true,
        category: true,
        productReviews: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async rateProduct(productId, userId, ratingValue, comment) {
    console.log(ratingValue)
    // 1. Upsert the review
    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
      update: {
        rating: ratingValue,
        comment: comment,
      },
      create: {
        productId,
        userId,
        rating: ratingValue,
        comment: comment,
      },
    });

    // 2. Fetch all reviews for this product to calculate new average
    const aggregations = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const exactAverage = aggregations._avg.rating || 0;
    const reviewCount = aggregations._count.rating || 0;
    console.log(exactAverage)

    // 3. Custom .25 margin rounding logic
    const roundedRating = Math.round(Number(exactAverage) * 2) / 2;
    console.log(roundedRating)

    // 4. Update the Product model
    return await prisma.product.update({
      where: { id: productId },
      data: {
        rating: roundedRating,
        reviews: reviewCount,
      },
      include: {
        productImages: true,
        category: true,
        productReviews: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      }
    });
  }
}
