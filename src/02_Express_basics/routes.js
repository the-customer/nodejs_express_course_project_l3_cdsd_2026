import {
    Router
} from "express";
import {
    books
} from "./data.js";

export const router = Router();

/**
 * GET /
 */
router.get("/", (req, res) => {
    res.send("Express chapter 02 - Basics")
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
 * GET /books?q=&limit=&available=
 * Query Params
 */
router.get("/books", (req, res) => {
    const q = String(req.query.q || "").trim().toLowerCase();
    const available = req.query.available; //1, 0, undefined
    let limit = req.query.limit ? req.query.limit : "10";


    limit = Number(limit)
    // if (!limit) {
    if (Number.isNaN(limit) || limit <= 0) {
        return res.status(400).json({
            error: "limit should be a number > 0!"
        })
    }

    let results = [...books];

    //filtrer par disponibilite:
    if (available !== undefined) {
        if (!["0", "1"].includes(String(available))) {
            return res.status(400).json({
                error: "available should be 0 or 1!"
            })
        }
        const availableBoolean = available === "1"
        results = results.filter(b => b.available === availableBoolean);
    }
    //recherche: q
    if (q) {
        results = results.filter(b => {
            return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
        })
    }
    //applique limit
    results = results.slice(0, limit);

    return res.status(200).json({
        count: results.length,
        results
    });
});

/**
 * GET /books/:id
 * Path Params
 */
router.get("/books/:id", (req, res) => {
    const idBook = +req.params.id;
    if (Number.isNaN(idBook)) {
        return res.status(400).json({
            error: "id must be a number!"
        })
    }
    const book = books.find(b => b.id === idBook)
    return res.status(200).json({
        book
    })
});
/**
 * POST /books
 * Body json
 */
router.post("/books", (req, res) => {
    const {
        title,
        author
    } = req.body || {}


    if (!title || String(title).trim().length < 2) {
        return res.status(200).json({
            error: "title is required (min 2chars)!"
        })
    }

    if (!author || String(author).trim().length < 2) {
        return res.status(200).json({
            error: "author is required (min 2chars)!"
        })
    }

    const newBook = {
        id: books[books.length - 1].id + 1,
        title: String(title).trim(),
        author: String(author).trim(),
        available: true
    }

    books.push(newBook);
    return res.status(201).json({
        message: "book created",
        book: newBook
    });
});
/**
 * PATCH /books/:id
 * Modifier une partie
 */
router.patch("/books/:id", (req, res) => {
    const idBook = Number(req.params.id);
    if (Number.isNaN(idBook)) return res.status(400).json({
        error: "id must bi a number"
    });

    const book = books.find(b => b.id === idBook);
    if (!book) return res.status(404).json({
        error: "book not found!"
    });

    const {
        title,
        author,
        available
    } = req.body || {};
    if (title !== undefined) book.title = String(title).trim();
    if (author !== undefined) book.author = String(author).trim();

    if (available !== undefined) {
        if (typeof available !== "boolean") {
            return res.status(400).json({
                error: "available must be a boolean!"
            });
        }
        book.available = available;
    }

    return res.status(200).json({
        message: "book updated",
        book
    });
});
/**
 * DELETE /books/:id
 */
router.delete("/books/:id", (req, res) => {
    const idBook = Number(req.params.id);
    if (Number.isNaN(idBook)) return res.status(400).json({
        error: "id must bi a number"
    });
    const index = books.findIndex(b => b.id === idBook);
    if (index === -1) return res.status(400).json({
        error: "book not found!"
    });

    const deleted = books.splice(index, 1)[0];
    return res.status(200).json({
        message: "book deleted",
        deleted
    })
})