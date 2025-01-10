const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

// Submit a review
router.post("/submit", reviewController.submitReview);

// Moderate a review
router.post("/moderate", reviewController.moderateReview);

// Get pending reviews
router.get("/pending", reviewController.getPendingReviews);

module.exports = router;
