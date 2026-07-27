import express from "express";

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productsController.js";

// Futuramente
// import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ======================================
// PRODUTOS
// ======================================
import authMiddleware from "../middleware/auth.js";

// Listar todos
router.get("/", getProducts);

// Buscar por ID
router.get("/:id", getProductById);

// Criar
router.post("/", createProduct);

// Atualizar
router.put("/:id", updateProduct);

// Excluir
router.delete("/:id", deleteProduct);

export default router;