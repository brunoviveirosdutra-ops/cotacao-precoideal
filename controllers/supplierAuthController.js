import bcrypt from "bcryptjs";
import { getDatabase } from "../database/database.js";


export async function supplierLogin(req, res) {

    try {

        const db = await getDatabase();

        const { email, password } = req.body;


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
            [email]
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


        req.session.supplier = {

            id: supplier.id,
            company_name: supplier.company_name,
            email: supplier.email

        };


        res.json({

            success:true,
            supplier:req.session.supplier

        });


    } catch(error) {

        console.error(error);

        res.status(500).json({

            success:false,
            message:"Erro interno"

        });

    }

}