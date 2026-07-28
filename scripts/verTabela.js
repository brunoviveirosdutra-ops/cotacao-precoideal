import { getDatabase } from "../database/database.js";

const db = await getDatabase();

const colunas = await db.all(
    "PRAGMA table_info(suppliers)"
);

console.log(colunas);

process.exit(); 
