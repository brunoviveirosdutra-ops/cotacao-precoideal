import express from "express";

import {
    getSuppliers,
    getSupplierById,
    createSupplier,
    deleteSupplier,
    supplierLogin
} from "../controllers/suppliersController.js";


const router = express.Router();


// LOGIN FORNECEDOR
router.post("/login", supplierLogin);


// LISTAR FORNECEDORES
router.get("/", getSuppliers);


// BUSCAR FORNECEDOR POR ID
router.get("/:id", getSupplierById);


// CRIAR FORNECEDOR
router.post("/", createSupplier);


// EXCLUIR FORNECEDOR
router.delete("/:id", deleteSupplier);


export default router;