import express from "express";

import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct
} from "../controllers/productsController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

export default router;