import express from "express";
import { getDatabase } from "../database/database.js";

const router = express.Router();


/*
    BUSCAR COTAÇÃO PELO TOKEN DO FORNECEDOR
*/

router.get("/:token", async (req, res) => {

    try {

        const db = await getDatabase();

        const { token } = req.params;


        const supplierQuote = await db.get(`

            SELECT

                qs.id,
                qs.quote_id,
                qs.supplier_id,
                qs.viewed,
                q.title,
                q.description,
                q.deadline,
                s.company_name

            FROM quote_suppliers qs

            INNER JOIN quotes q
            ON q.id = qs.quote_id

            INNER JOIN suppliers s
            ON s.id = qs.supplier_id

            WHERE qs.access_token = ?

        `, [token]);



        if (!supplierQuote) {

            return res.status(404).json({

                success:false,

                message:"Link de cotação inválido."

            });

        }



        const products = await db.all(`

            SELECT

                p.id,
                p.name,
                qi.quantity

            FROM quote_items qi

            INNER JOIN products p
            ON p.id = qi.product_id

            WHERE qi.quote_id = ?

        `,[supplierQuote.quote_id]);



        // marca como visualizada

        await db.run(`

            UPDATE quote_suppliers

            SET viewed = 1

            WHERE access_token = ?

        `,[token]);



        res.json({

            quotation:{

                id:supplierQuote.quote_id,

                title:supplierQuote.title,

                description:supplierQuote.description,

                deadline:supplierQuote.deadline

            },


            supplier:{

                id:supplierQuote.supplier_id,

                company_name:supplierQuote.company_name

            },


            products


        });



    } catch(error){


        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro ao carregar cotação."

        });


    }


});



export default router;