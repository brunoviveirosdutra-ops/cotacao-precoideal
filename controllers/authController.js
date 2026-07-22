import bcrypt from "bcryptjs";
import { getDatabase } from "../database/database.js";


export async function adminLogin(req, res) {

    try {

        const { email, password } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                message: "Email e senha obrigatórios"
            });

        }


        const db = await getDatabase();


        const admin = await db.get(
            `
            SELECT *
            FROM admins
            WHERE email = ?
            `,
            [email]
        );


        if (!admin) {

            return res.status(401).json({
                message: "Usuário ou senha inválidos"
            });

        }


        const passwordValid = await bcrypt.compare(
            password,
            admin.password
        );


        if (!passwordValid) {

            return res.status(401).json({
                message: "Usuário ou senha inválidos"
            });

        }


        req.session.admin = {

            id: admin.id,
            name: admin.name,
            email: admin.email

        };


        return res.json({

            success: true,

            message: "Login realizado com sucesso",

            admin: req.session.admin

        });


    } catch (error) {

        console.error("ERRO LOGIN:", error);

        return res.status(500).json({

            message: error.message

        });

    }

}