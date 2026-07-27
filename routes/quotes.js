import express from "express";

import {

    getQuotes,
    getQuoteById,
    createQuote,
    updateQuote,
    deleteQuote

} from "../controllers/quotesController.js";

const router = express.Router();

// ======================================================
// LISTAR TODAS AS COTAÇÕES
// GET /api/quotes
// ======================================================



router.get(
    "/",
    getQuotes
);

// ======================================================
// BUSCAR UMA COTAÇÃO
// GET /api/quotes/:id
// ======================================================

router.get(
    "/:id",
    getQuoteById
);

// ======================================================
// CRIAR NOVA COTAÇÃO
// POST /api/quotes
// ======================================================

router.post(
    "/",
    createQuote
);

// ======================================================
// ATUALIZAR COTAÇÃO
// PUT /api/quotes/:id
// ======================================================

router.put(
    "/:id",
    updateQuote
);

// ======================================================
// EXCLUIR COTAÇÃO
// DELETE /api/quotes/:id
// ======================================================

router.delete(
    "/:id",
    deleteQuote
);

export default router;