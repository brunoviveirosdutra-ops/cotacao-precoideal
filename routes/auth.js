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

router.get("/me", (req, res) => {

    if (!req.session.admin) {
        return res.status(401).json({
            success: false
        });
    }

    res.json({
        success: true,
        admin: req.session.admin
    });

});
router.post("/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            success: true
        });

    });

});