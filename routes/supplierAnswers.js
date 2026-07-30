// ======================================================
// ROTAS - RESPOSTAS DO FORNECEDOR
// routes/supplierAnswers.js
// ======================================================


import express from "express";
import { getDatabase } from "../database/database.js";


const router = express.Router();



// ======================================================
// ENVIAR RESPOSTA DA COTAÇÃO
// ======================================================


router.post("/", async (req, res) => {


    try {


        // verificar fornecedor logado

        if (!req.session.supplier) {


            return res.status(401).json({

                success:false,

                message:"Fornecedor não autenticado."

            });


        }



        const supplierId =
            req.session.supplier.id;



        const db =
            await getDatabase();

            const quote = await db.get(
    `
    SELECT q.status

    FROM quotes q

    INNER JOIN quote_items qi

        ON qi.quote_id = q.id

    WHERE qi.id = ?

    `,
    [answers[0]?.quote_item_id]
);

if (!quote) {

    return res.status(404).json({

        success: false,

        message: "Cotação não encontrada."

    });

}

if (quote.status === "closed") {

    return res.status(400).json({

        success: false,

        message: "Esta cotação já foi encerrada."

    });

}


        const {
            answers = []
        } = req.body;



        if (!answers.length) {


            return res.status(400).json({

                success:false,

                message:"Nenhuma resposta enviada."

            });


        }



        console.log(
            "RESPOSTAS RECEBIDAS:",
            answers
        );





        for (const item of answers) {



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


                ON CONFLICT(
                    quote_item_id,
                    supplier_id
                )

                DO UPDATE SET

                    price = excluded.price,

                    observation = excluded.observation


            `, [

                item.quote_item_id,

                supplierId,

                item.price,

                item.observation || ""

            ]);



        }



        // ======================================================
        // ATUALIZAR STATUS DO FORNECEDOR NA COTAÇÃO
        // ======================================================


        await db.run(

            `

            UPDATE quote_suppliers

            SET

                answered = 1,

                answer_date = datetime('now')


            WHERE

                supplier_id = ?

            AND quote_id IN (

                SELECT

                    qi.quote_id

                FROM quote_items qi


                INNER JOIN supplier_answers sa

                    ON sa.quote_item_id = qi.id


                WHERE sa.supplier_id = ?

            )

            `,

            [

                supplierId,

                supplierId

            ]

        );





        res.json({

            success:true,

            message:
            "Cotação enviada com sucesso."

        });






    } catch(error) {



        console.error(

            "ERRO AO SALVAR RESPOSTA:",
            error

        );



        res.status(500).json({

            success:false,

            message:
            "Erro interno ao salvar resposta."

        });



    }



});






export default router;