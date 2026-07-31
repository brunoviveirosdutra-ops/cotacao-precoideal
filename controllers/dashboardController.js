import { getDatabase } from "../database/database.js";

export const getDashboard = async (req, res) => {

    try {

        const db = await getDatabase();

        const totalCotacoes = await db.get(`
            SELECT COUNT(*) AS total
            FROM quotes
        `);

        const cotacoesAbertas = await db.get(`
            SELECT COUNT(*) AS total
            FROM quotes
            WHERE status = 'open'
        `);

        const cotacoesEncerradas = await db.get(`
            SELECT COUNT(*) AS total
            FROM quotes
            WHERE status = 'closed'
        `);

        const totalFornecedores = await db.get(`
            SELECT COUNT(*) AS total
            FROM suppliers
            WHERE status = 'active'
        `);

        const totalProdutos = await db.get(`
            SELECT COUNT(*) AS total
            FROM products
            WHERE status = 'active'
        `);

        const respostasRecebidas = await db.get(`
            SELECT COUNT(*) AS total
            FROM supplier_answers
        `);

        res.json({

            totalCotacoes: totalCotacoes.total,

            cotacoesAbertas: cotacoesAbertas.total,

            cotacoesEncerradas: cotacoesEncerradas.total,

            totalFornecedores: totalFornecedores.total,

            totalProdutos: totalProdutos.total,

            respostasRecebidas: respostasRecebidas.total

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Erro ao carregar dashboard."

        });

    }

};