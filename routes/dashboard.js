import express from "express";
import { getDatabase } from "../database/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {

        const db = await getDatabase();

        const fornecedores = await db.get(
            "SELECT COUNT(*) AS total FROM suppliers"
        );

        const produtos = await db.get(
            "SELECT COUNT(*) AS total FROM products"
        );

        const cotacoes = await db.get(
            "SELECT COUNT(*) AS total FROM quotes"
        );

        const respostas = await db.get(
    "SELECT COUNT(*) AS total FROM supplier_answers"
);

        res.json({
            fornecedores: fornecedores.total,
            produtos: produtos.total,
            cotacoes: cotacoes.total,
            respostas: respostas.total
        });

    } catch (erro) {

        console.error("ERRO DO DASHBOARD:");
        console.error(erro);

        res.status(500).json({
            message: erro.message
        });

    }
});

export default router;