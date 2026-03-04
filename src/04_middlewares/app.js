import express from "express";
import apiRoutes from "./routes/index.js";
import {
    requireJSON
} from "./middlewares/requireJSON.middleware.js";
import {
    requestId
} from "./middlewares/requestId.middleware.js";
import {
    rateLimiter
} from "./middlewares/rateLimiter.middleware.js";



export function createApp() {
    const app = express();
    //recuperer le Body JSON
    app.use(express.json())

    //global middleware
    app.use(requireJSON);
    app.use(requestId);
    app.use(rateLimiter({
        windowMs: 60000,
        maxRequests: 10,
        skip: (req) => {
            return req.path === "/api/v1/health"
        }
    }));

    //Utiliser le router:
    app.use('/api/v1/', apiRoutes);

    return app;
}