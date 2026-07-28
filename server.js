import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";


// ===================================================
// AMBIENTE
// ===================================================

dotenv.config();


// ===================================================
// BANCO DE DADOS
// ===================================================

import "./database/init.js";


// ===================================================
// ROTAS
// ===================================================

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import quotesRoutes from "./routes/quotes.js";
import productsRoutes from "./routes/products.js";
import suppliersRoutes from "./routes/suppliers.js";
import quotationsRouter from "./routes/quotations.js";
import publicQuotationRouter from "./routes/publicQuotation.js";
import supplierAnswersRouter from "./routes/supplierAnswers.js";
import comparisonRoutes from "./routes/comparison.js";
import supplierAuthRoutes from "./routes/supplierAuth.js";



const app = express();

const PORT = process.env.PORT || 3000;



// ===================================================
// __dirname ES MODULE
// ===================================================

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



// ===================================================
// MIDDLEWARES
// ===================================================


app.use(
    helmet({
        contentSecurityPolicy:false
    })
);


app.use(
    cors({
        origin:true,
        credentials:true
    })
);


app.use(compression());


app.use(express.json());


app.use(
    express.urlencoded({
        extended:true
    })
);



// ===================================================
// SESSÃO
// ===================================================


app.use(
    session({

        secret:
            process.env.SESSION_SECRET ||
            "chave-temporaria-segura",

        resave:false,

        saveUninitialized:false,

        name:"cotacao.sid",

        cookie:{

            httpOnly:false,

            secure:false,

            sameSite:"lax",

            maxAge:1000 * 60 * 60 * 2

        }

    })
);



// ===================================================
// ARQUIVOS PÚBLICOS
// ===================================================


app.use(
    express.static(
        path.join(__dirname,"public")
    )
);



// ===================================================
// API ROUTES
// ===================================================


// ADMIN LOGIN

app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/dashboard",
    dashboardRoutes
);


app.use(
    "/api/products",
    productsRoutes
);


app.use(
    "/api/quotes",
    quotesRoutes
);


// FORNECEDORES ADMIN

app.use(
    "/api/suppliers",
    suppliersRoutes
);


// ÁREA DO FORNECEDOR

app.use(
    "/api/supplier",
    supplierAuthRoutes
);


// COTAÇÕES

app.use(
    "/api/quotations",
    quotationsRouter
);


app.use(
    "/api/public/quotation",
    publicQuotationRouter
);


// RESPOSTAS

app.use(
    "/api/supplier-answer",
    supplierAnswersRouter
);


// COMPARAÇÃO

app.use(
    "/api/comparison",
    comparisonRoutes
);



// ===================================================
// PÁGINA PRINCIPAL
// ===================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "admin",
            "login.html"
        )
    );

});

// ===================================================
// API NÃO ENCONTRADA
// ===================================================


app.use(
    (req,res)=>{


        if(
            req.originalUrl.startsWith("/api/")
        ){

            return res.status(404).json({

                success:false,

                message:
                "Rota API não encontrada."

            });

        }


        res.status(404).send(
            "Página não encontrada"
        );


    }
);



// ===================================================
// ERROS
// ===================================================


app.use(
    (err,req,res,next)=>{


        console.error(
            "Erro:",
            err
        );


        res.status(500).json({

            success:false,

            message:
            "Erro interno do servidor."

        });


    }
);



// ===================================================
// SERVIDOR
// ===================================================


app.listen(
    PORT,
    ()=>{


        console.log("");

        console.log(
            "========================================"
        );

        console.log(
            "🚀 Sistema Cotação Preço Ideal"
        );

        console.log(
            "========================================"
        );

        console.log(
            `🌐 Servidor: http://localhost:${PORT}`
        );

        console.log(
            `📂 Ambiente: ${process.env.NODE_ENV || "development"}`
        );

        console.log(
            "========================================"
        );

        console.log("");

    }
);