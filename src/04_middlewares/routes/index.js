// regrouper tous les fichier .routes.js

import {
    Router
} from "express";

import booksRouter from "./books.routes.js";
import loansRouter from "./loans.routes.js";

const router = Router();

/**
 * GET /
 */
router.get("/", (req, res) => {
    res.send("Node/Express Course")
});

/**
 * GET /health
 */
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        chapter: 2,
        time: new Date().toISOString()
    })
});

/**
 * Books Routes
 */
router.use("/books", booksRouter);
router.use("/loans", loansRouter);

export default router;