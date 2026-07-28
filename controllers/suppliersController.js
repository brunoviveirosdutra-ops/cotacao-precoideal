   import bcrypt from "bcryptjs";
import { getDatabase } from "../database/database.js";


// =====================================
// LISTAR FORNECEDORES
// =====================================

export async function getSuppliers(req, res) {

    try {

        const db = await getDatabase();

        const suppliers = await db.all(
            `
            SELECT 
                id,
                company_name,
                cnpj,
                contact_name,
                email,
                phone,
                status,
                created_at
            FROM suppliers
            ORDER BY id DESC
            `
        );


        res.json({
            success:true,
            suppliers
        });


    } catch(error) {

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Erro ao buscar fornecedores"
        });

    }

}



// =====================================
// BUSCAR FORNECEDOR POR ID
// =====================================

export async function getSupplierById(req, res) {

    try {

        const db = await getDatabase();


        const supplier = await db.get(
            `
            SELECT *
            FROM suppliers
            WHERE id = ?
            `,
            [req.params.id]
        );


        if(!supplier){

            return res.status(404).json({
                success:false,
                message:"Fornecedor não encontrado"
            });

        }


        res.json({
            success:true,
            supplier
        });


    } catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Erro ao buscar fornecedor"
        });

    }

}



// =====================================
// CRIAR FORNECEDOR
// =====================================

export async function createSupplier(req,res){

    try {


        const db = await getDatabase();


        const {
            company_name,
            cnpj,
            contact_name,
            email,
            phone,
            password
        } = req.body;



        if(!company_name || !email || !password){

            return res.status(400).json({
                success:false,
                message:"Nome, email e senha são obrigatórios"
            });

        }



        const passwordHash = await bcrypt.hash(password,10);



        const result = await db.run(
            `
            INSERT INTO suppliers
            (
                company_name,
                cnpj,
                contact_name,
                email,
                phone,
                password,
                status
            )
            VALUES (?,?,?,?,?,?,?)
            `,
            [
                company_name,
                cnpj || null,
                contact_name || null,
                email,
                phone || null,
                passwordHash,
                "ativo"
            ]
        );



        res.json({

            success:true,

            message:"Fornecedor criado com sucesso",

            id: result.lastID

        });



    } catch(error){

        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro ao criar fornecedor"

        });

    }

}



// =====================================
// EXCLUIR FORNECEDOR
// =====================================

export async function deleteSupplier(req,res){

    try {


        const db = await getDatabase();


        await db.run(
            `
            DELETE FROM suppliers
            WHERE id = ?
            `,
            [
                req.params.id
            ]
        );


        res.json({

            success:true,

            message:"Fornecedor excluído"

        });



    } catch(error){

        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro ao excluir fornecedor"

        });

    }

}



// =====================================
// LOGIN DO FORNECEDOR
// =====================================

export async function supplierLogin(req, res) {

    console.log("BODY RECEBIDO:", req.body);

    try {

        const db = await getDatabase();

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                success:false,

                message:"Email e senha obrigatórios"

            });

        }



        const supplier = await db.get(
            `
            SELECT *
            FROM suppliers
            WHERE email = ?
            `,
            [
                email
            ]
        );



        if (!supplier) {

            return res.status(401).json({

                success:false,

                message:"Fornecedor não encontrado"

            });

        }



        const passwordOk = await bcrypt.compare(
            password,
            supplier.password
        );



        if (!passwordOk) {

            return res.status(401).json({

                success:false,

                message:"Senha inválida"

            });

        }



        // CORREÇÃO DO STATUS
        if (supplier.status !== "ativo") {

            return res.status(403).json({

                success:false,

                message:"Fornecedor inativo"

            });

        }



        // CRIAR SESSÃO

        req.session.supplier = {

            id: supplier.id,

            company_name: supplier.company_name,

            email: supplier.email

        };



        console.log(
            "LOGIN - SESSÃO CRIADA:",
            req.session
        );



        // GARANTIR GRAVAÇÃO DA SESSÃO

        req.session.save((err)=>{


            if(err){

                console.error(
                    "ERRO AO SALVAR SESSÃO:",
                    err
                );


                return res.status(500).json({

                    success:false,

                    message:"Erro ao salvar sessão"

                });

            }

console.log("LOGIN SESSION ID:", req.sessionID);
console.log("LOGIN SESSION:", req.session);

            res.json({

                success:true,

                supplier:req.session.supplier

            });


        });



    } catch(error){

        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erro no login"

        });


    }

}