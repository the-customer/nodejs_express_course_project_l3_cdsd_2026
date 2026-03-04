import {
    Router
} from "express";
import {
    books
} from "../data/books.data.js";
import loansRouter from "../routes/loans.routes.js";
import {
    loans
} from "../data/loans.data.js";
import {
    logger
} from "../middlewares/logger.middleware.js";
import {
    timer
} from "../middlewares/timer.mddleware.js";
import {
    authMock
} from "../middlewares/auth.mock.middleware.js";

const router = Router();
router.use(logger);

/**
 * Param global : bookId
 * s'execute une fois quand :id est present 
 */
router.param("id", (req, res, next, id) => {
    const bookId = Number(id)
    if (Number.isNaN(bookId)) {
        return res.status(400).json({
            error: "id must be a number!"
        })
    }
    const book = books.find(b => b.id === bookId);
    if (!book) {
        return res.status(400).json({
            error: "book not found!"
        })
    }
    //injecter l'id dans les parametre global
    req.book = book;
    next()
})

/**
 * GET /books?q=&limit=&available=&sort=title|id
 * Query Params
 */


router.get("/", timer, authMock("ADMIN"), (req, res) => {
    const q = String(req.query.q || "").trim().toLowerCase();
    const available = req.query.available; //1, 0, undefined
    let limit = req.query.limit ? req.query.limit : "10";
    const sort = String(req.query.sort || "").trim().toLowerCase();


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

    //tri
    if (sort) {
        // if (sort !== "id" && sort !== "title")
        if (!["id", "title"].includes(sort)) {
            return res.status(400).json({
                error: "sort must be 'id' or 'title"
            })
        }

        results.sort(function (a, b) {
            if (sort === 'id') {
                return b.id - a.id
            }
            //trier par title
            return a.title.localeCompare(b.title)
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
 * POST /books
 * Body json
 */
router.post("/", authMock("USER"), (req, res) => {
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
 * GET /books/stat
 */
router.get('/stats', (req, res) => {
    //
    const total = books.length;
    const available = books.filter(book => book.available).length;
    const unavailable = total - available;
    return res.status(200).json({
        totalBooks: total,
        availableBooks: available,
        unavailableBooks: unavailable
    })
})
/**
 * GET /books/:id
 * Path Params
 */
router.get("/:id", (req, res) => {
    const book = req.book;
    return res.status(200).json({
        book
    })
});
/**
 * PATCH /books/:id
 * Modifier une partie
 */
router.patch("/:id", (req, res) => {
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
router.delete("/:id", authMock("ADMIN"), (req, res) => {
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

/**
 * GET /api/v1/books/:id/loans
 * AVEC Nested routes
 */
router.use('/:id/loans', loansRouter)



export default router;