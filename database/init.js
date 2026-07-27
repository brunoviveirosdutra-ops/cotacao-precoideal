import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { getDatabase } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {

    try {

        const db = await getDatabase();

        const schemaPath = path.join(__dirname, "schema.sql");

        const schema = fs.readFileSync(schemaPath, "utf8");

        await db.exec(schema);

        console.log("📄 Schema carregado com sucesso.");

        const adminExists = await db.get(
            "SELECT id FROM admins LIMIT 1"
        );

        if (!adminExists) {

            const passwordHash = await bcrypt.hash(
                process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
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
                    process.env.DEFAULT_ADMIN_EMAIL || "admin@cotacao.com",
                    passwordHash
                ]
            );

            console.log("👤 Administrador padrão criado.");

        } else {

            console.log("👤 Administrador já existente.");

        }

        console.log("✅ Banco de dados inicializado com sucesso.");

    } catch (error) {

        console.error("❌ Erro ao inicializar o banco.");
        console.error(error);

        process.exit(1);

    }

}

initializeDatabase();