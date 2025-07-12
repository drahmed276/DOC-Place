const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Configure multer for product image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Product validation rules
const productValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('availability')
    .isIn(['available', 'not-available'])
    .withMessage('Availability must be either available or not-available')
];

// In-memory storage for demo (replace with database in production)
let products = [
  {
    id: 1,
    name: "Classic Balto",
    category: "balto",
    size: ["M", "L", "XL"],
    color: "white",
    material: "cotton",
    price: 300,
    image: "assets/images/PNGs/balto png.png",
    description: "Very comfort balto during your shift",
    availability: "available"
  },
  {
    id: 2,
    title: 'Black Scrub',
    price: 450,
    description: 'Comfortable black scrub',
    image: '',
    availability: 'available',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 12,
    name: "Blue Scrub",
    category: "scrub",
    size: ["M", "L", "XL"],
    color: "blue",
    material: "cotton",
    price: 450,
    image: "assets/images/PNGs/Blue Scrub.png",
    description: "Comfortable blue scrub",
    availability: "available"
  }
];

let nextId = 3;

// Get all products
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Create new product
router.post('/', upload.single('image'), productValidation, async (req, res) => {
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

    const productData = {
      id: nextId++,
      title: req.body.title,
      price: parseFloat(req.body.price),
      description: req.body.description,
      availability: req.body.availability,
      image: req.file ? `/uploads/products/${req.file.filename}` : '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    products.push(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: productData
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// Update product
router.put('/:id', upload.single('image'), productValidation, async (req, res) => {
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

    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = {
      ...products[productIndex],
      title: req.body.title,
      price: parseFloat(req.body.price),
      description: req.body.description,
      availability: req.body.availability,
      updatedAt: new Date()
    };

    // Update image if new one uploaded
    if (req.file) {
      updatedProduct.image = `/uploads/products/${req.file.filename}`;
    }

    products[productIndex] = updatedProduct;

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

// Toggle product availability
router.patch('/:id/toggle-availability', async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const currentStatus = products[productIndex].availability;
    const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
    
    products[productIndex].availability = newStatus;
    products[productIndex].updatedAt = new Date();

    res.json({
      success: true,
      message: `Product availability updated to ${newStatus}`,
      data: products[productIndex]
    });

  } catch (error) {
    console.error('Error toggling product availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product availability'
    });
  }
});

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
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