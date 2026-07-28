import bcrypt from "bcryptjs";
import { getDatabase } from "../database/database.js";


export async function adminLogin(req, res) {

    try {


        const email = req.body.email?.trim();
        const password = req.body.password;


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "E-mail e senha são obrigatórios."

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

                success: false,

                message: "Usuário ou senha inválidos."

            });

        }


        const passwordValid = await bcrypt.compare(
            password,
            admin.password
        );


        if (!passwordValid) {

            return res.status(401).json({

                success: false,

                message: "Usuário ou senha inválidos."

            });

        }


        // Cria sessão do administrador
        req.session.admin = {

            id: admin.id,

            name: admin.name,

            email: admin.email

        };
console.log("ID DA SESSÃO:", req.sessionID);
console.log("ADMIN:", req.session.admin);

        console.log(
            "SESSÃO CRIADA:",
            req.session.admin
        );


        // Salva a sessão antes de responder
        await new Promise((resolve, reject) => {

            req.session.save((err) => {

                if (err) {

                    reject(err);

                } else {

                    resolve();

                }

            });

        });


        return res.json({

            success: true,

            message: "Login realizado com sucesso.",

            admin: req.session.admin

        });



    } catch(error) {


        console.error(
            "ERRO LOGIN:",
            error
        );


        return res.status(500).json({

            success:false,

            message:"Erro interno do servidor."

        });


    }

}