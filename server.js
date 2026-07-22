import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Corrigir caminho das pastas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ============================
// MIDDLEWARES
// ============================

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ 
    extended: true 
}));


// Sessão
app.use(
    session({
        secret: process.env.SESSION_SECRET || "chave-temporaria-segura",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 2
        }
    })
);


// Arquivos públicos
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ============================
// ROTAS TESTE
// ============================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.get("/", (req, res) => {

    res.send(`
        <h1>Sistema Cotação Preço Ideal</h1>
        <p>Servidor funcionando com sucesso 🚀</p>
    `);

});

// ============================
// INICIAR SERVIDOR
// ============================

app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log("🚀 Servidor iniciado");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("--------------------------------");

});