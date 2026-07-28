import express from "express";

import {
    getPublicQuotation
} from "../controllers/publicQuotationController.js";


const router = express.Router();



router.get(
    "/quotation/:token",
    getPublicQuotation
);



export default router;