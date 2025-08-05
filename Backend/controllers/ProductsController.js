const Product = require('../models/ProductsModel');
const fs = require('fs');
const path = require('path');

// Get all products with pagination and filtering
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }
    
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }
    
    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'name_asc':
          sort = { name: 1 };
          break;
        case 'name_desc':
          sort = { name: -1 };
          break;
        case 'rating':
          sort = { 'ratings.average': -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
      }
    }
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('reviews.user', 'name email');
    
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name email avatar');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Get product by slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ 'seo.slug': req.params.slug })
      .populate('reviews.user', 'name email avatar');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    let productData = { ...req.body };
    
    // Parse stringified JSON fields from FormData
    if (typeof productData.tags === 'string') {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch (e) {
        productData.tags = [];
      }
    }
    
    if (typeof productData.discount === 'string') {
      try {
        productData.discount = JSON.parse(productData.discount);
      } catch (e) {
        productData.discount = { percentage: 0, validUntil: null };
      }
    }
    
    if (typeof productData.shipping === 'string') {
      try {
        productData.shipping = JSON.parse(productData.shipping);
      } catch (e) {
        productData.shipping = { weight: null, freeShipping: false, shippingCost: 0 };
      }
    }
    
    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file, index) => ({
        url: `http://localhost:3000/uploads/products/${file.filename}`,
        alt: req.body.imageAlt || `Product image ${index + 1}`,
        isPrimary: index === 0 // First image is primary
      }));
      
      // If there are existing images from URL, merge them
      if (req.body.images && Array.isArray(req.body.images)) {
        const urlImages = req.body.images.filter(img => img.url && !img.url.startsWith('/uploads/'));
        productData.images = [...uploadedImages, ...urlImages];
      } else {
        productData.images = uploadedImages;
      }
    } else if (req.body.images) {
      // Handle URL-based images only
      if (typeof req.body.images === 'string') {
        try {
          productData.images = JSON.parse(req.body.images);
        } catch (e) {
          productData.images = [{ url: req.body.images, alt: 'Product image', isPrimary: true }];
        }
      }
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    let productData = { ...req.body };
    
    // Parse stringified JSON fields from FormData
    if (typeof productData.tags === 'string') {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch (e) {
        productData.tags = [];
      }
    }
    
    if (typeof productData.discount === 'string') {
      try {
        productData.discount = JSON.parse(productData.discount);
      } catch (e) {
        productData.discount = { percentage: 0, validUntil: null };
      }
    }
    
    if (typeof productData.shipping === 'string') {
      try {
        productData.shipping = JSON.parse(productData.shipping);
      } catch (e) {
        productData.shipping = { weight: null, freeShipping: false, shippingCost: 0 };
      }
    }
    
    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file, index) => ({
        url: `http://localhost:3000/uploads/products/${file.filename}`,
        alt: req.body.imageAlt || `Product image ${index + 1}`,
        isPrimary: index === 0
      }));
      
      // If there are existing images from URL, merge them
      if (req.body.images && Array.isArray(req.body.images)) {
        const urlImages = req.body.images.filter(img => img.url && !img.url.startsWith('/uploads/'));
        productData.images = [...uploadedImages, ...urlImages];
      } else {
        productData.images = uploadedImages;
      }
    } else if (req.body.images) {
      // Handle URL-based images only
      if (typeof req.body.images === 'string') {
        try {
          productData.images = JSON.parse(req.body.images);
        } catch (e) {
          productData.images = [{ url: req.body.images, alt: 'Product image', isPrimary: true }];
        }
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Delete uploaded files if they exist
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        if (image.url && image.url.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '..', 'public', image.url);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }
    
    // Soft delete the product
    product.isActive = false;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.search(q)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reviews.user', 'name email');
    
    const total = await Product.countDocuments({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    });
    
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const products = await Product.findByCategory(category)
      .skip(skip)
      .limit(limit)
      .populate('reviews.user', 'name email');
    
    const total = await Product.countDocuments({ category, isActive: true });
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.findFeatured()
      .limit(limit)
      .populate('reviews.user', 'name email');
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
};

// Add review to product
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id; // Assuming user is authenticated
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    await product.addReview(userId, rating, comment);
    
    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' },
          lowStockProducts: {
            $sum: {
              $cond: [{ $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', 10] }] }, 1, 0]
            }
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
          }
        }
      }
    ]);
    
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {},
        byCategory: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product statistics',
      error: error.message
    });
  }
};

// Bulk update products
const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, updates } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updates,
      { runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} products`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error bulk updating products',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  addReview,
  getProductStats,
  bulkUpdateProducts
};
