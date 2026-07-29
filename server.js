// ======================================================
// SERVER.JS
// Sistema Cotação Preço Ideal
// ======================================================


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";


// Banco
import "./database/init.js";


// Rotas
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import quotesRoutes from "./routes/quotes.js";
import productsRoutes from "./routes/products.js";
import suppliersRoutes from "./routes/suppliers.js";

import supplierAuthRoutes from "./routes/supplierAuth.js";


// NOVA ROTA
import supplierAnswersRoutes from "./routes/supplierAnswers.js";



dotenv.config();



const app = express();

const PORT =
    process.env.PORT || 3000;



// ============================
// CAMINHOS
// ============================


const __filename =
    fileURLToPath(import.meta.url);


const __dirname =
    path.dirname(__filename);




// ============================
// MIDDLEWARES
// ============================


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



app.use(
    compression()
);



app.use(
    express.json()
);



app.use(
    express.urlencoded({
        extended:true
    })
);




// ============================
// SESSÃO
// ============================


app.use(
    session({

        secret:
            process.env.SESSION_SECRET ||
            "chave-temporaria-segura",


        resave:false,


        saveUninitialized:false,


        cookie:{

            httpOnly:true,

            secure:false,

            sameSite:"lax",

            maxAge:
                1000 * 60 * 60 * 2

        }

    })
);





// ============================
// ARQUIVOS PÚBLICOS
// ============================


app.use(
    express.static(
        path.join(__dirname,"public")
    )
);




// ============================
// HOME
// ============================


app.get("/",(req,res)=>{


    res.send(`

        <h1>Sistema Cotação Preço Ideal</h1>

        <p>Servidor funcionando 🚀</p>

    `);


});





// ============================
// ROTAS API
// ============================



// Administrador

app.use(
    "/api/auth",
    authRoutes
);



// Fornecedor login + cotações

app.use(
    "/api/supplier",
    supplierAuthRoutes
);



// Respostas fornecedor

app.use(
    "/api/supplier-answer",
    supplierAnswersRoutes
);



// Dashboard

app.use(
    "/api/dashboard",
    dashboardRoutes
);



// Cotações

app.use(
    "/api/quotes",
    quotesRoutes
);



// Produtos

app.use(
    "/api/products",
    productsRoutes
);



// Fornecedores

app.use(
    "/api/suppliers",
    suppliersRoutes
);







// ============================
// ERRO 404
// ============================


app.use(
    (req,res)=>{


        res.status(404).json({

            success:false,

            message:"Rota não encontrada."

        });


    }
);







// ============================
// SERVIDOR
// ============================


app.listen(
    PORT,
    ()=>{


        console.log("--------------------------------");

        console.log(
            "🚀 Sistema Cotação Preço Ideal"
        );


        console.log(
            `🌐 http://localhost:${PORT}`
        );


        console.log("--------------------------------");


    }
);