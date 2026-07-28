import express from "express";
import { adminLogin } from "../controllers/authController.js";

const router = express.Router();

// ======================================
// TESTE
// ======================================

router.get("/teste", (req, res) => {

    res.json({
        success: true,
        message: "Rota de autenticação funcionando."
    });

});

// ======================================
// LOGIN
// ======================================

router.post("/login", adminLogin);

// ======================================
// ADMIN LOGADO
// ======================================

router.get("/me", (req, res) => {

    if (!req.session.admin) {
        return res.status(401).json({
            success: false,
            message: "Usuário não autenticado."
        });
    }

    res.json({
        success: true,
        admin: req.session.admin
    });

});

// ======================================
// LOGOUT
// ======================================

router.post("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Erro ao encerrar a sessão."
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Logout realizado com sucesso."
        });

    });

});

export default router;