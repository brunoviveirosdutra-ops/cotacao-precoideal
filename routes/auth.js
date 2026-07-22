import express from "express";
import { adminLogin } from "../controllers/authController.js";

const router = express.Router();


router.get("/teste", (req, res) => {

    res.json({
        mensagem: "Rota de autenticação funcionando"
    });

});


router.post("/login", adminLogin);


export default router;