import { getDatabase } from "../database/database.js";


// =====================================
// COTAÇÕES DO FORNECEDOR LOGADO
// =====================================

export async function getSupplierQuotes(req, res) {

console.log("COOKIE RECEBIDO:", req.headers.cookie);
console.log("SESSION ID:", req.sessionID);
console.log("SESSION:", req.session);

    try {

        if (!req.session.supplier) {

            return res.status(401).json({
                success:false,
                message:"Fornecedor não autenticado"
            });

        }


        const supplierId = req.session.supplier.id;


        const db = await getDatabase();


        const quotes = await db.all(
            `
            SELECT

                q.id,
                q.title,
                q.description,
                q.deadline,
                q.status,
                qs.viewed,
                qs.answered,
                qs.created_at

            FROM quote_suppliers qs

            INNER JOIN quotes q
                ON q.id = qs.quote_id

            WHERE qs.supplier_id = ?

            ORDER BY q.created_at DESC

            `,
            [
                supplierId
            ]
        );


        res.json({

            success:true,

            quotes

        });


    } catch(error) {


        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro ao buscar cotações"

        });


    }

}

// =====================================
// PRODUTOS DE UMA COTAÇÃO
// =====================================

export async function getSupplierQuoteItems(req, res) {

    try {

        if (!req.session.supplier) {

            return res.status(401).json({
                success:false,
                message:"Fornecedor não autenticado"
            });

        }


        const supplierId = req.session.supplier.id;

        const quoteId = req.params.id;


        const db = await getDatabase();


        // verifica se a cotação pertence ao fornecedor

        const quoteSupplier = await db.get(
            `
            SELECT *
            FROM quote_suppliers
            WHERE quote_id = ?
            AND supplier_id = ?
            `,
            [
                quoteId,
                supplierId
            ]
        );


        if (!quoteSupplier) {

            return res.status(403).json({

                success:false,

                message:"Cotação não pertence ao fornecedor"

            });

        }



        const items = await db.all(
            `
            SELECT

                qi.id,
                p.name,
                p.unit,
                qi.quantity

            FROM quote_items qi

            INNER JOIN products p
                ON p.id = qi.product_id

            WHERE qi.quote_id = ?

            `,
            [
                quoteId
            ]
        );


        res.json({

            success:true,

            items

        });



    } catch(error) {


        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro ao buscar produtos da cotação"

        });


    }

}