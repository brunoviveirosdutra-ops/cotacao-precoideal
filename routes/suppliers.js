import express from "express";

import {
    getSuppliers,
    getSupplierById,
    createSupplier,
    deleteSupplier
} from "../controllers/suppliersController.js";

const router = express.Router();

router.get("/", getSuppliers);

router.get("/:id", getSupplierById);

router.post("/", createSupplier);

router.delete("/:id", deleteSupplier);

export default router;