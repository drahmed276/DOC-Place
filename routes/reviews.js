const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/reviews/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'review-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Validation rules
const reviewValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Review must be between 10 and 500 characters')
];

// Submit a new review
router.post('/', upload.single('photo'), reviewValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if user has already submitted a review recently (anti-spam)
    const recentReview = await Review.findOne({
      ipAddress: req.ip,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    if (recentReview) {
      return res.status(429).json({
        success: false,
        message: 'You can only submit one review per day'
      });
    }

    // Create review object
    const reviewData = {
      name: req.body.name,
      city: req.body.city,
      rating: parseInt(req.body.rating),
      review: req.body.review,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Add photo if uploaded
    if (req.file) {
      reviewData.photo = `/uploads/reviews/${req.file.filename}`;
    }

    // Create and save review
    const review = new Review(reviewData);
    await review.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Your review will be reviewed within 24-48 hours.',
      data: {
        id: review._id,
        name: review.name,
        city: review.city,
        rating: review.rating,
        status: review.status
      }
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review. Please try again.'
    });
  }
});

// Get approved reviews for frontend display
router.get('/approved', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ status: 'approved' })
      .sort({ approvedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name city rating review photo approvedAt');

    const total = await Review.countDocuments({ status: 'approved' });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Get review statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Review.getStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 2MB.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!'
    });
  }

  next(error);
});

module.exports = router; 