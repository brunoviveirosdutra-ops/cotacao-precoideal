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

// ======================================================
// ENCERRAR COTAÇÃO
// POST /api/quotes/:id/close
// ======================================================

router.post("/:id/close", async (req, res) => {

    try {

        const db = await getDatabase();

        await db.run(
            `
            UPDATE quotes
            SET
                status = 'closed',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            `,
            [req.params.id]
        );

        res.json({

            success: true,

            message: "Cotação encerrada com sucesso."

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Erro ao encerrar cotação."

        });

    }

});

export default router;