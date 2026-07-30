import { getDatabase } from "./database/database.js";

const db = await getDatabase();

const resultado = await db.all(`
    SELECT *
    FROM quote_suppliers
`);

console.log(resultado);

process.exit();