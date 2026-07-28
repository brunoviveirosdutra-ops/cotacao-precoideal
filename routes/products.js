import express from "express";

import {
    getProducts,
    getProductById,
    createProduct,
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
// CADASTRAR PRODUTO
// ======================================================

router.post(
    "/",
    createProduct
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


// ======================================================
// BUSCAR PRODUTO POR ID
// ======================================================

router.get(
    "/:id",
    getProductById
);


export default router;