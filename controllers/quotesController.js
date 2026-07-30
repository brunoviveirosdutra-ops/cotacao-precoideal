import { getDatabase } from "../database/database.js";


// ======================================================
// LISTAR TODAS AS COTAÇÕES
// ======================================================

export const getQuotes = async (req, res) => {

    try {

        const db = await getDatabase();

        const quotes = await db.all(`
            SELECT
                q.*,
                COUNT(DISTINCT qi.id) AS total_products,
                COUNT(DISTINCT qs.supplier_id) AS total_suppliers
            FROM quotes q
            LEFT JOIN quote_items qi
                ON qi.quote_id = q.id
            LEFT JOIN quote_suppliers qs
                ON qs.quote_id = q.id
            GROUP BY q.id
            ORDER BY q.created_at DESC
        `);

        res.json(quotes);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Erro ao listar cotações."
        });

    }

};



// ======================================================
// BUSCAR COTAÇÃO POR ID
// ======================================================

export const getQuoteById = async (req, res) => {

    try {

        const db = await getDatabase();

        const { id } = req.params;


        const quote = await db.get(
            `
            SELECT *
            FROM quotes
            WHERE id = ?
            `,
            [id]
        );


        if (!quote) {

            return res.status(404).json({

                success:false,

                message:"Cotação não encontrada."

            });

        }



        // PRODUTOS DA COTAÇÃO

        const products = await db.all(
            `
            SELECT
                qi.*,
                p.name,
                p.unit

            FROM quote_items qi

            INNER JOIN products p
                ON p.id = qi.product_id

            WHERE qi.quote_id = ?
            `,
            [id]
        );



 // FORNECEDORES DA COTAÇÃO COM STATUS DE RESPOSTA

const suppliers = await db.all(
    `
    SELECT

        qs.*,

        s.company_name,

        s.email,


        CASE

            WHEN EXISTS (

                SELECT 1

                FROM supplier_answers sa

                INNER JOIN quote_items qi

                    ON qi.id = sa.quote_item_id

                WHERE sa.supplier_id = qs.supplier_id

                AND qi.quote_id = qs.quote_id

            )

            THEN 'respondido'

            ELSE 'aguardando'

        END AS response_status


    FROM quote_suppliers qs


    INNER JOIN suppliers s

        ON s.id = qs.supplier_id


    WHERE qs.quote_id = ?

    `,
    [id]
);




        // RESPOSTAS DOS FORNECEDORES

        const answers = await db.all(
            `
            SELECT

                sa.id,

                sa.quote_item_id,

                sa.supplier_id,

                sa.price,

                sa.observation,

                s.company_name,

                p.name AS product_name,

                p.unit,

                qi.quantity


            FROM supplier_answers sa


            INNER JOIN quote_items qi
                ON qi.id = sa.quote_item_id


            INNER JOIN products p
                ON p.id = qi.product_id


            INNER JOIN suppliers s
                ON s.id = sa.supplier_id


            WHERE qi.quote_id = ?


            ORDER BY sa.price ASC

            `,
            [id]
        );



        res.json({

            ...quote,

            products,

            suppliers,

            answers

        });



    } catch(error) {


        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro ao buscar cotação."

        });


    }

};




// ======================================================
// CRIAR COTAÇÃO
// ======================================================

export const createQuote = async (req,res)=>{

    const db = await getDatabase();

    try {


        const {
            title,
            description,
            deadline,
            products,
            suppliers

        } = req.body;



        console.log(
            "PRODUTOS RECEBIDOS:",
            products
        );


        console.log(
            "FORNECEDORES RECEBIDOS:",
            suppliers
        );



        if(!title || !deadline){

            return res.status(400).json({

                success:false,

                message:"Título e prazo são obrigatórios."

            });

        }



        await db.run(
            "BEGIN TRANSACTION"
        );



        const result = await db.run(
            `
            INSERT INTO quotes
            (
                title,
                description,
                deadline,
                status
            )

            VALUES
            (
                ?,?,?,'open'
            )
            `,
            [
                title,
                description || "",
                deadline
            ]
        );



        const quoteId = result.lastID;



        if(Array.isArray(products)){


            for(const product of products){


                await db.run(
                    `
                    INSERT INTO quote_items
                    (
                        quote_id,
                        product_id,
                        quantity
                    )

                    VALUES
                    (
                        ?,?,?
                    )
                    `,
                    [
                        quoteId,
                        product.product_id,
                        product.quantity
                    ]
                );


            }

        }




        if(Array.isArray(suppliers)){


            for(const supplierId of suppliers){


                await db.run(
                    `
                    INSERT INTO quote_suppliers
                    (
                        quote_id,
                        supplier_id
                    )

                    VALUES
                    (
                        ?,?
                    )
                    `,
                    [
                        quoteId,
                        supplierId
                    ]
                );


            }

        }




        await db.run(
            "COMMIT"
        );



        res.status(201).json({

            success:true,

            id:quoteId,

            message:"Cotação criada com sucesso."

        });



    } catch(error){


        console.error(error);


        await db.run(
            "ROLLBACK"
        );


        res.status(500).json({

            success:false,

            message:"Erro ao criar cotação."

        });


    }

};



// ======================================================
// ATUALIZAR COTAÇÃO
// ======================================================

export const updateQuote = async(req,res)=>{


    try{


        const db = await getDatabase();


        const {id}=req.params;


        const {
            title,
            description,
            deadline,
            status

        }=req.body;



        await db.run(
            `
            UPDATE quotes

            SET

                title=?,

                description=?,

                deadline=?,

                status=?

            WHERE id=?

            `,
            [
                title,
                description,
                deadline,
                status,
                id
            ]
        );



        res.json({

            success:true,

            message:"Cotação atualizada."

        });



    }catch(error){


        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro ao atualizar."

        });


    }

};



// ======================================================
// EXCLUIR COTAÇÃO
// ======================================================

export const deleteQuote = async(req,res)=>{


    try{


        const db = await getDatabase();


        const {id}=req.params;



        await db.run(
            "DELETE FROM quotes WHERE id=?",
            [id]
        );



        res.json({

            success:true,

            message:"Cotação excluída."

        });



    }catch(error){


        console.error(error);



        res.status(500).json({

            success:false,

            message:"Erro ao excluir."

        });



    }


};