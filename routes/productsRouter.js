import express from 'express';
import { createNewProduct, getProductById, getProducts, getProductsByCategory, getProductsByPriceRange, updateProductStarRating, deleteProductsById } from "../controllers/productsController.js"
import authenticateToken from '../middlewares/authMiddleware.js';

const productsRouter = express.Router()
productsRouter.get('/', getProducts)
productsRouter.get('/category', getProductsByCategory)
productsRouter.get('/price', getProductsByPriceRange)
productsRouter.get('/:id', getProductById)
productsRouter.post('/', createNewProduct)
productsRouter.put('/:id', updateProductStarRating)
productsRouter.delete('/:id', authenticateToken, deleteProductsById)

export { productsRouter}