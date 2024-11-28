// import express from 'express';
// import { 
//     createProduct,
//     getAllProducts,
//     getFeaturedProducts,
//     updateProduct,
//     deleteProduct,
//     getRecommendedProducts,
//     getProductsByCategory,
//     toggleFeatProd,
//     getProductById, 
//     getCategories
// } from '../controllers/productController.js';
// import { authenticate, adminRoute, protectRoute } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Public routes (no authentication required)
// router.get('/', getAllProducts);
// router.get('/recommendations', getRecommendedProducts);
// router.get('/featured', getFeaturedProducts);
// router.get('/category/:category', getProductsByCategory);
// router.get('/:id', getProductById);
// router.get('/categories', getCategories);

// router.use(authenticate);
// router.post('/', adminRoute, createProduct);
// router.put('/:id', adminRoute, updateProduct);
// router.delete('/:id', adminRoute, deleteProduct);

// // Protected routes (authentication required)
// // router.post('/', protectRoute, adminRoute, createProduct);
// // router.patch('/:id', protectRoute, adminRoute, toggleFeatProd);
// // router.delete('/:id', protectRoute, adminRoute, deleteProduct);

// export { router };


import express from 'express';
import { 
    createProduct,
    getAllProducts,
    getFeaturedProducts,
    updateProduct,
    deleteProduct,
    getRecommendedProducts,
    getProductsByCategory,
    toggleFeatProd,
    getProductById, 
    getCategories
} from '../controllers/productController.js';
import { authenticate, adminRoute, protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/categories', getCategories); // Move this BEFORE /:id
router.get('/featured', getFeaturedProducts);
router.get('/recommendations', getRecommendedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById); // This should come after other specific routes
router.get('/', getAllProducts);

// Protected routes
router.use(authenticate);
router.post('/', adminRoute, createProduct);
router.put('/:id', adminRoute, updateProduct);
router.delete('/:id', adminRoute, deleteProduct);

export { router };

