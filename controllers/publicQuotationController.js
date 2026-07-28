import { getDatabase } from "../database/database.js";


// ======================================================
// BUSCAR COTAÇÃO PELO TOKEN DO FORNECEDOR
// ======================================================

export const getPublicQuotation = async (req, res) => {

    try {

        const db = await getDatabase();

        const { token } = req.params;


        if (!token) {

            return res.status(400).json({
                success: false,
                message: "Token não informado."
            });

        }



        // Buscar fornecedor e cotação

        const quotation = await db.get(

            `
            SELECT

                q.id,
                q.title,
                q.description,
                q.deadline,
                q.status,

                qs.supplier_id,
                qs.access_token,
                qs.viewed,
                qs.answered,

                s.company_name,
                s.email

            FROM quote_suppliers qs

            INNER JOIN quotes q
                ON q.id = qs.quote_id

            INNER JOIN suppliers s
                ON s.id = qs.supplier_id

            WHERE qs.access_token = ?

            `,

            [token]

        );



        if (!quotation) {

            return res.status(404).json({

                success: false,

                message:
                "Cotação não encontrada ou link inválido."

            });

        }



        // Buscar produtos da cotação

        const products = await db.all(

            `
            SELECT

                qi.id,
                qi.quantity,

                p.name,
                p.unit

            FROM quote_items qi

            INNER JOIN products p
                ON p.id = qi.product_id

            WHERE qi.quote_id = ?

            `,

            [quotation.id]

        );



        // Marca como visualizada

        await db.run(

            `
            UPDATE quote_suppliers

            SET viewed = 1

            WHERE access_token = ?

            `,

            [token]

        );



        res.json({

            success: true,

            quotation,

            products

        });



    } catch(error) {


        console.error(error);


        res.status(500).json({

            success:false,

            message:
            "Erro ao carregar cotação."

        });


    }

};
