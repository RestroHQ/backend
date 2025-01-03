const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Submit a review
async function submitReview(userId, content, rating) {
  return prisma.review.create({
    data: {
      content,
      rating,
      userId,
    },
  });
}

// Moderate a review (approve or reject)
async function moderateReview(reviewId, approve) {
  return prisma.review.update({
    where: { id: reviewId },
    data: { approved: approve },
  });
}

// Get pending reviews (for moderation)
async function getPendingReviews() {
  return prisma.review.findMany({
    where: { approved: false },
  });
}

module.exports = { submitReview, moderateReview, getPendingReviews };
