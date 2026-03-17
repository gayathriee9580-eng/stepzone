const express = require("express");
const router = express.Router();
const { getProducts, getWomenProducts, getKidsFootwear, addProduct ,  getSingleProduct, getSimilarProducts ,  getProductsByCategory , getProductById  } = require("../controllers/productController");


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Fetch all products from database
 *     tags:
 *       - User APIs
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 */

// Routes
router.get("/", getProducts);
router.get("/women", getWomenProducts);
router.get("/kids", getKidsFootwear);

router.get("/similar/:id", getSimilarProducts);
router.get("/category/:category", getProductsByCategory); 


router.post("/", addProduct);
router.get("/:id", getSingleProduct);
router.get("/:id", getProductById);



module.exports = router;

