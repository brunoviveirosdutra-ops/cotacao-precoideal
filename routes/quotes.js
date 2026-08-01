import express from "express";
import ExcelJS from "exceljs";

import { getDatabase } from "../database/database.js";

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

// ======================================================
// EXPORTAR COTAÇÃO PARA EXCEL
// GET /api/quotes/:id/export
// ======================================================

router.get("/:id/export", async (req, res) => {

    try {

        const db = await getDatabase();

        const { id } = req.params;

        const respostas = await db.all(
            `
            SELECT

                p.name AS produto,

                qi.quantity,

                p.unit,

                s.company_name,

                sa.price,

                sa.observation

            FROM supplier_answers sa

            INNER JOIN quote_items qi
                ON qi.id = sa.quote_item_id

            INNER JOIN products p
                ON p.id = qi.product_id

            INNER JOIN suppliers s
                ON s.id = sa.supplier_id

            WHERE qi.quote_id = ?

            ORDER BY p.name, sa.price
            `,
            [id]
        );

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Cotação");

        worksheet.columns = [
            { header: "Produto", key: "produto", width: 30 },
            { header: "Quantidade", key: "quantity", width: 15 },
            { header: "Unidade", key: "unit", width: 12 },
            { header: "Fornecedor", key: "company_name", width: 35 },
            { header: "Preço", key: "price", width: 15 },
            { header: "Observação", key: "observation", width: 40 }
        ];

        respostas.forEach(item => {

            worksheet.addRow(item);

        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=cotacao-${id}.xlsx`
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Erro ao exportar Excel."

        });

    }

});

export default router;