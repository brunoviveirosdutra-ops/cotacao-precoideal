import { getDatabase } from "../database/database.js";

// ======================================================
// LISTAR PRODUTOS
// ======================================================

export const getProducts = async (req, res) => {

    try {

        const db = await getDatabase();

        const products = await db.all(`
            SELECT *
            FROM products
            ORDER BY name
        `);

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao listar produtos."
        });

    }

};

// ======================================================
// BUSCAR PRODUTO POR ID
// ======================================================

export const getProductById = async (req, res) => {

    try {

        const db = await getDatabase();

        const product = await db.get(
            "SELECT * FROM products WHERE id = ?",
            [req.params.id]
        );

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Produto não encontrado."
            });

        }

        res.json(product);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao buscar produto."
        });

    }

};

// ======================================================
// CADASTRAR PRODUTO
// ======================================================

export const createProduct = async (req, res) => {

    try {

        const db = await getDatabase();

        const {
            name,
            category,
            unit,
            description
        } = req.body;

        if (!name?.trim() || !category?.trim() || !unit?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Nome, categoria e unidade são obrigatórios."
            });

        }

        const result = await db.run(
            `
            INSERT INTO products
            (
                name,
                category,
                unit,
                description
            )
            VALUES
            (?, ?, ?, ?)
            `,
            [
                name,
                category,
                unit,
                description || ""
            ]
        );

        res.status(201).json({
            success: true,
            id: result.lastID,
            message: "Produto cadastrado com sucesso."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao cadastrar produto."
        });

    }

};

// ======================================================
// ATUALIZAR PRODUTO
// ======================================================

export const updateProduct = async (req, res) => {

    try {

        const db = await getDatabase();

        const id = req.params.id;

        const {
            name,
            category,
            unit,
            description
        } = req.body;

        if (!name?.trim() || !category?.trim() || !unit?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Nome, categoria e unidade são obrigatórios."
            });

        }

        const product = await db.get(
            "SELECT id FROM products WHERE id = ?",
            [id]
        );

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Produto não encontrado."
            });

        }

        await db.run(
            `
            UPDATE products
            SET
                name = ?,
                category = ?,
                unit = ?,
                description = ?
            WHERE id = ?
            `,
            [
                name,
                category,
                unit,
                description || "",
                id
            ]
        );

        res.json({
            success: true,
            message: "Produto atualizado com sucesso."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao atualizar produto."
        });

    }

};

// ======================================================
// EXCLUIR
// ======================================================

export const deleteProduct = async (req, res) => {

    try {

        const db = await getDatabase();

        await db.run(
            `
            UPDATE products
            SET status = 'inactive'
            WHERE id = ?
            `,
            [req.params.id]
        );

        res.json({

            success: true,

            message: "Produto inativado com sucesso."

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Erro ao inativar produto."

        });

    }

};

// ======================================================
// REATIVAR PRODUTO
// ======================================================

export const activateProduct = async (req, res) => {

    try {

        const db = await getDatabase();

        const { id } = req.params;

        // Verifica se o produto existe
        const product = await db.get(
            `
            SELECT id, status
            FROM products
            WHERE id = ?
            `,
            [id]
        );

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Produto não encontrado."
            });

        }

        // Se já está ativo, rejeita
        if (product.status === "active") {

            return res.status(400).json({
                success: false,
                message: "Este produto já está ativado."
            });

        }

        // Reativar produto (muda status para 'active')
        await db.run(
            `UPDATE products SET status = 'active' WHERE id = ?`,
            [id]
        );

        res.json({
            success: true,
            message: "Produto reativado com sucesso."
        });

    } catch (error) {
        console.error("Erro ao reativar produto:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao reativar produto."
        });
    }
};
