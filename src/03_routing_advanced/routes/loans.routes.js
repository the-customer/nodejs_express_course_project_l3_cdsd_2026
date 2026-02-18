import {
    Router
} from "express";
import {
    loans
} from "../data/loans.data.js";

const router = Router();

router.get('/', (req, res) => {
    const book = req.book || null
    console.log(book)
    if (!book) {
        return res.status(400).json({
            error: "book is not found"
        });
    }
    const bookId = book.id;
    const bookLoans = loans.filter(l => l.bookId === bookId)

    return res.json({
        bookId,
        results: bookLoans,
        count: bookLoans.length
    })
})

export default router;