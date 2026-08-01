import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

// Inicializa banco de dados
import "./database/init.js";

// Rotas
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import quotesRoutes from "./routes/quotes.js";
import productsRoutes from "./routes/products.js";
import suppliersRoutes from "./routes/suppliers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// CAMINHOS
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// MIDDLEWARES
// ======================================================

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "chave-temporaria-segura",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 2
        }
    })
);

// ======================================================
// ARQUIVOS ESTÁTICOS
// ======================================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// ======================================================
// ROTA PRINCIPAL
// ======================================================

app.get("/", (req, res) => {

    res.send(`
        <h1>🚀 Sistema Cotação Preço Ideal</h1>
        <p>Servidor funcionando com sucesso.</p>
    `);

});

// ======================================================
// ROTAS DA API
// ======================================================

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/quotes", quotesRoutes);

app.use("/api/products", productsRoutes);

app.use("/api/suppliers", suppliersRoutes);

// ======================================================
// ROTA 404 API
// ======================================================

app.use("/api", (req, res) => {

    res.status(404).json({
        success: false,
        message: "Rota não encontrada."
    });

});

// ======================================================
// INICIAR SERVIDOR
// ======================================================

app.listen(PORT, () => {

    console.log("==================================");
    console.log("🚀 Sistema Cotação Preço Ideal");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("==================================");

});