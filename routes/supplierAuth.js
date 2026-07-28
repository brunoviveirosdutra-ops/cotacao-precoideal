import express from "express";

import {
    supplierLogin
} from "../controllers/suppliersController.js";


import {
    getSupplierQuotes
} from "../controllers/supplierQuotesController.js";

import {
    getSupplierQuoteItems
} from "../controllers/supplierQuotesController.js";


const router = express.Router();



router.post(
    "/login",
    supplierLogin
);



router.get(
    "/quotes",
    getSupplierQuotes
);

router.get(
    "/quotes/:id/items",
    getSupplierQuoteItems
);



export default router;