import { getDatabase } from "./database/database.js";

const db = await getDatabase();

const dados = await db.all(`
    SELECT 
        q.id AS quote_id,
        q.status,
        s.id AS supplier_id,
        s.company_name
    FROM quote_suppliers qs
    JOIN quotes q ON q.id = qs.quote_id
    JOIN suppliers s ON s.id = qs.supplier_id
`);

console.log(dados);

process.exit();