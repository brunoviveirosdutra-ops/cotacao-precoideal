import bcrypt from "bcryptjs";
import { getDatabase } from "../database/database.js";


const db = await getDatabase();


const fornecedores = await db.all(
    `
    SELECT 
        id,
        password
    FROM suppliers
    `
);


for (const fornecedor of fornecedores) {


    // evita criptografar duas vezes
    if (
        fornecedor.password.startsWith("$2b$")
    ) {
        continue;
    }


    const hash = await bcrypt.hash(
        fornecedor.password,
        10
    );


    await db.run(
        `
        UPDATE suppliers
        SET password = ?
        WHERE id = ?
        `,
        [
            hash,
            fornecedor.id
        ]
    );


}


console.log("✅ Senhas migradas com sucesso");


process.exit();