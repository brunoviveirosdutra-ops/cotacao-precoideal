import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { getDatabase } from "./database.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function initializeDatabase(){

    try {

        const db = await getDatabase();


        const schemaPath = path.join(
            __dirname,
            "schema.sql"
        );


        const schema = fs.readFileSync(
            schemaPath,
            "utf8"
        );


        await db.exec(schema);


        // Criar administrador padrão

        const adminExists = await db.get(
            "SELECT id FROM admins LIMIT 1"
        );


        if(!adminExists){

            const passwordHash = await bcrypt.hash(
                "admin123",
                10
            );


            await db.run(
                `
                INSERT INTO admins
                (
                    name,
                    email,
                    password
                )
                VALUES
                (?,?,?)
                `,
                [
                    "Administrador",
                    "admin@cotacao.com",
                    passwordHash
                ]
            );


            console.log(
                "✅ Administrador padrão criado"
            );

        }


        console.log(
            "✅ Banco de dados pronto"
        );


        await db.close();


    } catch(error){

        console.error(
            "❌ Erro:",
            error
        );

    }

}


initializeDatabase();