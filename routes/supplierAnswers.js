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