import express from "express";
import { getDatabase } from "../database/database.js";

const router = express.Router();


/*
    ENVIAR RESPOSTA DA COTAÇÃO
*/

router.post("/:token", async (req, res) => {

    try {

        const db = await getDatabase();

        const { token } = req.params;


        const {
            answers = [],
            observation = ""
        } = req.body;


        if (!answers.length) {

            return res.status(400).json({

                success: false,

                message: "Nenhum produto informado."

            });

        }


        const supplierQuote = await db.get(`

            SELECT *

            FROM quote_suppliers

            WHERE access_token = ?

        `, [

            token

        ]);


        if (!supplierQuote) {

            return res.status(404).json({

                success:false,

                message:"Token inválido."

            });

        }



        for (const item of answers) {


            const quoteItem = await db.get(`

                SELECT id

                FROM quote_items

                WHERE quote_id = ?

                AND product_id = ?

            `, [

                supplierQuote.quote_id,

                item.product_id

            ]);



            if (!quoteItem) {

                continue;

            }



            await db.run(`

                INSERT INTO supplier_answers

                (

                    quote_item_id,

                    supplier_id,

                    price,

                    observation

                )

                VALUES

                (?, ?, ?, ?)

                ON CONFLICT(quote_item_id, supplier_id)

                DO UPDATE SET

                    price = excluded.price,

                    observation = excluded.observation,

                    created_at = CURRENT_TIMESTAMP


            `, [

                quoteItem.id,

                supplierQuote.supplier_id,

                item.price,

                observation

            ]);

        }



        await db.run(`

            UPDATE quote_suppliers

            SET

                answered = 1,

                answer_date = CURRENT_TIMESTAMP

            WHERE access_token = ?

        `, [

            token

        ]);



        res.json({

            success:true,

            message:"Cotação respondida com sucesso."

        });



    } catch(error) {


        console.error(
            "ERRO RESPOSTA FORNECEDOR:",
            error
        );


        res.status(500).json({

            success:false,

            message:"Erro ao enviar resposta."

        });

    }

});



export default router;