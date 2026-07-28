import express from "express";

import {
    compareQuotation
} from "../controllers/comparisonController.js";


const router = express.Router();



router.get(
    "/:id",
    compareQuotation
);



export default router;