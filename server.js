import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";


// ======================================================
// BANCO DE DADOS
// ======================================================

import "./database/init.js";


// ======================================================
// ROTAS
// ======================================================

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import quotesRoutes from "./routes/quotes.js";
import productsRoutes from "./routes/products.js";
import suppliersRoutes from "./routes/suppliers.js";


// ======================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ======================================================

import authMiddleware from "./middleware/auth.js";


// ======================================================
// CONFIGURAÇÕES
// ======================================================

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


// Necessário para Render / produção
app.set("trust proxy", 1);



// ======================================================
// MIDDLEWARES
// ======================================================


app.use(
    helmet({
        contentSecurityPolicy: false
    })
);



app.use(
    cors({

        origin: "http://localhost:3000",

        credentials: true

    })
);



app.use(compression());



app.use(express.json());



app.use(
    express.urlencoded({
        extended:true
    })
);



// ======================================================
// SESSÃO
// ======================================================

app.use(
    session({

        name: "cotacao.sid",

        secret:
            process.env.SESSION_SECRET ||
            "chave-temporaria-segura",

        resave: false,

        saveUninitialized: false,

        rolling: true,

        cookie: {

            httpOnly: true,

            secure: false,

            sameSite: "lax",

            maxAge:
                1000 * 60 * 60 * 2

        }

    })
);
// ======================================================
// VARIÁVEL DO ADMIN LOGADO
// ======================================================


app.use((req,res,next)=>{


    if(req.session?.admin){

        res.locals.admin = req.session.admin;

    }


    next();

});



// ======================================================
// ARQUIVOS PÚBLICOS
// ======================================================


app.use(
    express.static(
        path.join(__dirname,"public")
    )
);



// ======================================================
// ROTAS PÚBLICAS
// ======================================================


app.use(
    "/api/auth",
    authRoutes
);



// ======================================================
// ROTAS PROTEGIDAS
// ======================================================


app.use(
    "/api/dashboard",
    authMiddleware,
    dashboardRoutes
);



app.use(
    "/api/quotes",
    authMiddleware,
    quotesRoutes
);



app.use(
    "/api/products",
  authMiddleware,
    productsRoutes
);



app.use(
    "/api/suppliers",
  authMiddleware,
    suppliersRoutes
);



// ======================================================
// PÁGINA INICIAL
// ======================================================


app.get("/",(req,res)=>{


    res.send(`

        <h1>🚀 Sistema Cotação Preço Ideal</h1>

        <hr>

        <p>Servidor funcionando com sucesso.</p>

        <p><strong>Versão:</strong> 1.0.0</p>

        <p><strong>Ambiente:</strong>
        ${process.env.NODE_ENV || "development"}
        </p>

    `);


});



// ======================================================
// HEALTH CHECK
// ======================================================


app.get("/health",(req,res)=>{


    res.json({

        success:true,

        status:"online",

        uptime:process.uptime(),

        timestamp:new Date().toISOString()

    });


});



// ======================================================
// ROTA NÃO ENCONTRADA
// ======================================================


app.use((req,res)=>{


    res.status(404).json({

        success:false,

        message:"Rota não encontrada."

    });


});



// ======================================================
// ERROS GERAIS
// ======================================================


app.use((err,req,res,next)=>{


    console.error("======================");

    console.error("ERRO NO SERVIDOR");

    console.error(err);

    console.error("======================");


    res.status(err.status || 500)
    .json({

        success:false,

        message:
        process.env.NODE_ENV === "production"

        ? "Erro interno do servidor."

        : err.message

    });


});



// ======================================================
// INICIAR SERVIDOR
// ======================================================


app.listen(PORT,()=>{


    console.log("==============================");

    console.log("🚀 Sistema Cotação Preço Ideal");

    console.log(
        `🌐 Servidor: http://localhost:${PORT}`
    );

    console.log(
        `📦 Ambiente: ${process.env.NODE_ENV || "development"}`
    );

    console.log(
        `🕒 ${new Date().toLocaleString("pt-BR")}`
    );

    console.log("==============================");


});