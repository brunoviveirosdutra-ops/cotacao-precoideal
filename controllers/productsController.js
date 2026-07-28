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
// BUSCAR PRODUTO
// ======================================================

export const getProductById = async (req, res) => {

    try {

        const db = await getDatabase();

        const product = await db.get(
            "SELECT * FROM products WHERE id=?",
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
            (
                ?, ?, ?, ?
            )
            `,

            [
                name,
                category,
                unit,
                description
            ]

        );

        res.json({

            success: true,

            id: result.lastID

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
// INATIVAR PRODUTO
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

        await db.run(

            `
            UPDATE products
            SET status = 'active'
            WHERE id = ?
            `,

            [req.params.id]

        );

        res.json({

            success: true,

            message: "Produto reativado com sucesso."

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Erro ao reativar produto."

        });

    }

};