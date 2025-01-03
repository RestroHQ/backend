const reviewService = require('../services/reviewService');

// Submit a review
async function submitReview(req, res) {
  try {
    const { userId, content, rating } = req.body;
    const review = await reviewService.submitReview(userId, content, rating);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Moderate a review
async function moderateReview(req, res) {
  try {
    const { reviewId, approve } = req.body;
    const review = await reviewService.moderateReview(reviewId, approve);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get pending reviews
async function getPendingReviews(req, res) {
  try {
    const reviews = await reviewService.getPendingReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { submitReview, moderateReview, getPendingReviews };
