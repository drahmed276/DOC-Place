const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// Simple admin authentication middleware (replace with proper auth in production)
const adminAuth = (req, res, next) => {
  const adminToken = req.headers['admin-token'];
  
  // For demo purposes, accept any token. In production, implement proper JWT validation
  if (!adminToken) {
    return res.status(401).json({
      success: false,
      message: 'Admin authentication required'
    });
  }
  
  next();
};

// Get all reviews for admin dashboard
router.get('/reviews', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Get review statistics
router.get('/reviews/stats', adminAuth, async (req, res) => {
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

// Approve a review
router.put('/reviews/:id/approve', adminAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Review is already approved'
      });
    }

    await review.approve(req.headers['admin-token'] || 'admin');

    res.json({
      success: true,
      message: 'Review approved successfully',
      data: review
    });

  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve review'
    });
  }
});

// Reject a review
router.put('/reviews/:id/reject', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Review is already rejected'
      });
    }

    await review.reject(req.headers['admin-token'] || 'admin', reason);

    res.json({
      success: true,
      message: 'Review rejected successfully',
      data: review
    });

  } catch (error) {
    console.error('Error rejecting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject review'
    });
  }
});

// Delete a review
router.delete('/reviews/:id', adminAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Delete photo file if exists
    if (review.photo) {
      const fs = require('fs');
      const path = require('path');
      const photoPath = path.join(__dirname, '..', review.photo);
      
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// Get a single review
router.get('/reviews/:id', adminAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review'
    });
  }
});

// Bulk actions
router.post('/reviews/bulk-approve', adminAuth, async (req, res) => {
  try {
    const { reviewIds } = req.body;
    
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Review IDs array is required'
      });
    }

    const result = await Review.updateMany(
      { _id: { $in: reviewIds }, status: 'pending' },
      { 
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: req.headers['admin-token'] || 'admin'
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} reviews approved successfully`,
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    console.error('Error bulk approving reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve reviews'
    });
  }
});

router.post('/reviews/bulk-reject', adminAuth, async (req, res) => {
  try {
    const { reviewIds, reason } = req.body;
    
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Review IDs array is required'
      });
    }

    const result = await Review.updateMany(
      { _id: { $in: reviewIds }, status: 'pending' },
      { 
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedBy: req.headers['admin-token'] || 'admin',
        rejectionReason: reason
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} reviews rejected successfully`,
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    console.error('Error bulk rejecting reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject reviews'
    });
  }
});

module.exports = router; 