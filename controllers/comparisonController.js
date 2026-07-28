import { getDatabase } from "../database/database.js";


// ======================================================
// COMPARAR PREÇOS DA COTAÇÃO
// ======================================================

export const compareQuotation = async (req,res)=>{


    try{


        const db = await getDatabase();


        const quoteId = req.params.id;



        const products = await db.all(

            `
            SELECT

                qi.id,
                p.name,
                p.unit

            FROM quote_items qi

            INNER JOIN products p

            ON p.id = qi.product_id

            WHERE qi.quote_id = ?

            `,

            [
                quoteId
            ]

        );





        for(const product of products){


            product.suppliers = await db.all(

                `
                SELECT

                    s.company_name,
                    sa.price

                FROM supplier_answers sa


                INNER JOIN suppliers s

                ON s.id = sa.supplier_id


                WHERE sa.quote_item_id = ?


                ORDER BY sa.price ASC

                `,

                [
                    product.id
                ]

            );


        }





        res.json({

            success:true,

            products

        });



    }catch(error){


        console.error(error);



        res.status(500).json({

            success:false,

            message:"Erro ao comparar preços."

        });



    }


};