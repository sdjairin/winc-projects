import { PrismaClient } from "@prisma/client";

const createReview = async (comment, rating, propertyId, userId) => {
  const prisma = new PrismaClient();
  const newReview = {
    comment,
    rating,
    propertyId,
    userId,
  };

  const review = await prisma.review.create({
    data: newReview,
  });

  return review;
};

export default createReview;
