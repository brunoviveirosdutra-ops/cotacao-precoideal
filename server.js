import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";


// Inicializa variáveis de ambiente
dotenv.config();

// Inicializa o banco de dados
import "./database/init.js";

// Rotas
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import quotesRoutes from "./routes/quotes.js";
import productsRoutes from "./routes/products.js";
import suppliersRoutes from "./routes/suppliers.js";
import quotationsRouter from "./routes/quotations.js";
import publicQuotationRouter from "./routes/publicQuotation.js";
import supplierAnswersRouter from "./routes/supplierAnswers.js";

const app = express();

const PORT = process.env.PORT || 3000;

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===================================================
// MIDDLEWARES
// ===================================================

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

// ===================================================
// SESSÃO
// ===================================================

app.use(
    session({
        secret: process.env.SESSION_SECRET || "chave-temporaria-segura",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // alterar para true quando usar HTTPS
            maxAge: 1000 * 60 * 60 * 2 // 2 horas
        }
    })
);

// ===================================================
// ARQUIVOS ESTÁTICOS
// ===================================================

app.use(express.static(path.join(__dirname, "public")));

// ===================================================
// ROTA PRINCIPAL
// ===================================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ===================================================
// API
// ===================================================

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/quotes", quotesRoutes);

app.use("/api/products", productsRoutes);

app.use("/api/suppliers", suppliersRoutes);

app.use("/api/quotations", quotationsRouter);

app.use("/api/public/quotation", publicQuotationRouter);

app.use("/api/supplier-answer", supplierAnswersRouter);
// ===================================================
// ROTA 404 API
// ===================================================

app.use((req, res, next) => {

    if (req.originalUrl.startsWith("/api/")) {

        return res.status(404).json({
            success: false,
            message: "Rota API não encontrada."
        });

    }

    next();

});
// ===================================================
// TRATAMENTO DE ERROS
// ===================================================

app.use((err, req, res, next) => {

    console.error("Erro:", err);

    res.status(500).json({
        success: false,
        message: "Erro interno do servidor."
    });

});

// ===================================================
// INICIAR SERVIDOR
// ===================================================

app.listen(PORT, () => {

    console.log("");
    console.log("========================================");
    console.log("🚀 Sistema Cotação Preço Ideal");
    console.log("========================================");
    console.log(`🌐 Servidor: http://localhost:${PORT}`);
    console.log(`📂 Ambiente: ${process.env.NODE_ENV || "development"}`);
    console.log("========================================");
    console.log("");

});