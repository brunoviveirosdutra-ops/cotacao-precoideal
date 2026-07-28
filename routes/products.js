import express from "express";

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    activateProduct
} from "../controllers/productsController.js";

const router = express.Router();


// ======================================================
// LISTAR PRODUTOS
// ======================================================
router.get(
    "/",
    getProducts
);


// ======================================================
// BUSCAR PRODUTO POR ID
// ======================================================
router.get(
    "/:id",
    getProductById
);


// ======================================================
// CADASTRAR PRODUTO
// ======================================================
router.post(
    "/",
    createProduct
);


// ======================================================
// ATUALIZAR PRODUTO
// ======================================================
router.put(
    "/:id",
    updateProduct
);


// ======================================================
// INATIVAR PRODUTO
// ======================================================
router.delete(
    "/:id",
    deleteProduct
);


// ======================================================
// REATIVAR PRODUTO
// ======================================================
router.put(
    "/activate/:id",
    activateProduct
);


export default router;