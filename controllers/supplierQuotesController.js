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
                qs.answer_date,
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



        console.log("COTAÇÕES DO FORNECEDOR:");
        console.log(quotes);



        res.json({

            success:true,

            quotes

        });



    } catch(error) {


        console.error(
            "ERRO GET SUPPLIER QUOTES:",
            error
        );


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

                p.name AS product,

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





        console.log("PRODUTOS DA COTAÇÃO:");
        console.log(items);





        res.json({

            success:true,

            items

        });






    } catch(error) {



        console.error(

            "ERRO GET SUPPLIER ITEMS:",

            error

        );



        res.status(500).json({

            success:false,

            message:"Erro ao buscar produtos da cotação"

        });



    }


}

// ======================================================
// MARCAR COTAÇÃO COMO VISUALIZADA
// ======================================================

export async function markQuoteViewed(req,res){

    console.log("MARK VIEWED CHAMADO");
    console.log("QUOTE ID:", req.params.id);
    console.log("SUPPLIER:", req.session.supplier);


    try {

        const { id } = req.params;

        const supplier = req.session.supplier;


        if (!supplier) {

            return res.status(401).json({
                success:false,
                message:"Fornecedor não autenticado."
            });

        }


        const db = await getDatabase();


        await db.run(
            `
            UPDATE quote_suppliers
            SET viewed = 1
            WHERE quote_id = ?
            AND supplier_id = ?
            `,
            [
                id,
                supplier.id
            ]
        );


        res.json({

            success:true,

            message:"Cotação marcada como visualizada."

        });


    } catch(error) {


        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro ao marcar visualização."

        });


    }

};

