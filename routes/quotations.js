import express from "express";
import crypto from "crypto";
import { getDatabase } from "../database/database.js";

const router = express.Router();


/**
 * LISTAR COTAÇÕES
 */
router.get("/", async (req, res) => {

    try {

        const db = await getDatabase();

        const quotes = await db.all(`
            SELECT *
            FROM quotes
            ORDER BY created_at DESC
        `);

        res.json(quotes);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Erro ao listar cotações."
        });

    }

});



/**
 * BUSCAR COTAÇÃO COMPLETA
 */
router.get("/:id", async (req,res)=>{

    try {

        const db = await getDatabase();


        const quote = await db.get(`
            SELECT *
            FROM quotes
            WHERE id = ?
        `,[req.params.id]);


        if(!quote){

            return res.status(404).json({
                success:false,
                message:"Cotação não encontrada."
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
        `,[req.params.id]);



        const suppliers = await db.all(`
            SELECT 
                s.id,
                s.company_name,
                qs.access_token
            FROM quote_suppliers qs
            INNER JOIN suppliers s
            ON s.id = qs.supplier_id
            WHERE qs.quote_id = ?
        `,[req.params.id]);



        res.json({

            quote,

            products,

            suppliers

        });


    } catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Erro ao buscar cotação."
        });

    }

});



/**
 * CRIAR COTAÇÃO COMPLETA
 */
router.post("/", async(req,res)=>{


    const db = await getDatabase();


    try {


        const {

            title,
            description,
            deadline,
            products,
            suppliers

        } = req.body;



        if(!title || !deadline){

            return res.status(400).json({

                success:false,
                message:"Título e prazo são obrigatórios."

            });

        }



        await db.run("BEGIN TRANSACTION");



        const quote = await db.run(`

            INSERT INTO quotes

            (
                title,
                description,
                deadline,
                status
            )

            VALUES

            (?, ?, ?, ?)

        `,[

            title,
            description || "",
            deadline,
            "open"

        ]);



        const quoteId = quote.lastID;



        // Produtos

        if(products && products.length){


            for(const item of products){


                await db.run(`

                    INSERT INTO quote_items

                    (
                        quote_id,
                        product_id,
                        quantity
                    )

                    VALUES

                    (?, ?, ?)

                `,[

                    quoteId,
                    item.product_id,
                    item.quantity

                ]);


            }

        }



        // Fornecedores

        if(suppliers && suppliers.length){


            for(const supplierId of suppliers){


                const token = crypto
                    .randomBytes(32)
                    .toString("hex");



                await db.run(`

                    INSERT INTO quote_suppliers

                    (
                        quote_id,
                        supplier_id,
                        access_token
                    )

                    VALUES

                    (?, ?, ?)

                `,[

                    quoteId,
                    supplierId,
                    token

                ]);


            }

        }



        await db.run("COMMIT");



        res.status(201).json({

            success:true,

            id:quoteId,

            message:"Cotação criada com sucesso."

        });



    }catch(error){


        await db.run("ROLLBACK");


        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro ao criar cotação."

        });


    }


});



/**
 * EXCLUIR COTAÇÃO
 */
router.delete("/:id", async(req,res)=>{


    try{

        const db = await getDatabase();


        await db.run(`

            DELETE FROM quotes

            WHERE id = ?

        `,[req.params.id]);



        res.json({

            success:true

        });


    }catch(error){


        console.error(error);


        res.status(500).json({

            success:false

        });


    }


});



export default router;