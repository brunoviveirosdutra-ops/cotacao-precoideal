import { getDatabase } from "../database/database.js";

// ======================================================
// LISTAR TODAS AS COTAÇÕES
// ======================================================

export const getQuotes = async (req, res) => {

    try {

        const db = await getDatabase();

        const quotes = await db.all(`
            SELECT
                q.*,
                COUNT(DISTINCT qi.id) AS total_products,
                COUNT(DISTINCT qs.supplier_id) AS total_suppliers
            FROM quotes q
            LEFT JOIN quote_items qi
                ON qi.quote_id = q.id
            LEFT JOIN quote_suppliers qs
                ON qs.quote_id = q.id
            GROUP BY q.id
            ORDER BY q.created_at DESC
        `);

        res.json(quotes);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao listar cotações."
        });

    }

};

// ======================================================
// BUSCAR COTAÇÃO POR ID
// ======================================================

export const getQuoteById = async (req, res) => {

    try {

        const db = await getDatabase();

        const { id } = req.params;

        const quote = await db.get(
            "SELECT * FROM quotes WHERE id = ?",
            [id]
        );

        if (!quote) {

            return res.status(404).json({
                success: false,
                message: "Cotação não encontrada."
            });

        }

        res.json(quote);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao buscar cotação."
        });

    }

};

// ======================================================
// CRIAR COTAÇÃO
// ======================================================

export const createQuote = async (req, res) => {

    try {

        const db = await getDatabase();

        const {
            title,
            description,
            deadline
        } = req.body;

        if (!title || !deadline) {

            return res.status(400).json({
                success: false,
                message: "Título e prazo são obrigatórios."
            });

        }

        const result = await db.run(
            `
            INSERT INTO quotes
            (
                title,
                description,
                deadline,
                status
            )
            VALUES
            (
                ?, ?, ?, 'open'
            )
            `,
            [
                title,
                description || "",
                deadline
            ]
        );

        res.status(201).json({
            success: true,
            id: result.lastID,
            message: "Cotação criada com sucesso."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao criar cotação."
        });

    }

};

// ======================================================
// ATUALIZAR COTAÇÃO
// ======================================================

export const updateQuote = async (req, res) => {

    try {

        const db = await getDatabase();

        const { id } = req.params;

        const {
            title,
            description,
            deadline,
            status
        } = req.body;

        await db.run(
            `
            UPDATE quotes
            SET
                title = ?,
                description = ?,
                deadline = ?,
                status = ?
            WHERE id = ?
            `,
            [
                title,
                description,
                deadline,
                status,
                id
            ]
        );

        res.json({
            success: true,
            message: "Cotação atualizada."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao atualizar."
        });

    }

};

// ======================================================
// EXCLUIR COTAÇÃO
// ======================================================

export const deleteQuote = async (req, res) => {

    try {

        const db = await getDatabase();

        const { id } = req.params;

        await db.run(
            "DELETE FROM quotes WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Cotação excluída."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao excluir."
        });

    }

};