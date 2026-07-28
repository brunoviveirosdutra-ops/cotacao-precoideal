import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(__dirname, "cotacao.db");

<<<<<<< HEAD
export async function getDatabase() {
    const db = await open({
        filename: databasePath,
        driver: sqlite3.Database
    });

    await db.exec(`
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
    `);

    return db;
=======
// Mantém uma única conexão durante toda a execução
let database = null;

export async function getDatabase() {

    if (database) {
        return database;
    }

    try {

        database = await open({
            filename: databasePath,
            driver: sqlite3.Database
        });

        await database.exec(`
            PRAGMA foreign_keys = ON;
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = NORMAL;
        `);

        console.log(`✅ Banco SQLite conectado: ${databasePath}`);

        return database;

    } catch (error) {

        console.error("❌ Erro ao conectar ao banco de dados.");
        console.error(error);

        throw error;

    }

>>>>>>> 48f28ebbd44cbf54f199d5de2636e227dcc38a46
}