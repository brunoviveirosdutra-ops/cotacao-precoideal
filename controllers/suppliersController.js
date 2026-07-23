import { getDatabase } from "../database/database.js";

// ======================================================
// LISTAR FORNECEDORES
// ======================================================

export const getSuppliers = async (req, res) => {

    try {

        const db = await getDatabase();

        const suppliers = await db.all(`
            SELECT *
            FROM suppliers
            ORDER BY company_name
        `);

        res.json(suppliers);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao listar fornecedores."
        });

    }

};

// ======================================================
// BUSCAR FORNECEDOR
// ======================================================

export const getSupplierById = async (req, res) => {

    try {

        const db = await getDatabase();

        const supplier = await db.get(
            "SELECT * FROM suppliers WHERE id = ?",
            [req.params.id]
        );

        if (!supplier) {

            return res.status(404).json({
                success: false,
                message: "Fornecedor não encontrado."
            });

        }

        res.json(supplier);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao buscar fornecedor."
        });

    }

};

// ======================================================
// CADASTRAR FORNECEDOR
// ======================================================

export const createSupplier = async (req, res) => {

    try {

        const db = await getDatabase();

        const {
            company_name,
            cnpj,
            contact_name,
            email,
            phone,
            password
        } = req.body;

        const result = await db.run(
            `
            INSERT INTO suppliers
            (
                company_name,
                cnpj,
                contact_name,
                email,
                phone,
                password
            )
            VALUES
            (?, ?, ?, ?, ?, ?)
            `,
            [
                company_name,
                cnpj,
                contact_name,
                email,
                phone,
                password
            ]
        );

        res.status(201).json({
            success: true,
            id: result.lastID
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao cadastrar fornecedor."
        });

    }

};

// ======================================================
// EXCLUIR FORNECEDOR
// ======================================================

export const deleteSupplier = async (req, res) => {

    try {

        const db = await getDatabase();

        await db.run(
            "DELETE FROM suppliers WHERE id = ?",
            [req.params.id]
        );

        res.json({
            success: true,
            message: "Fornecedor excluído."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao excluir fornecedor."
        });

    }

};