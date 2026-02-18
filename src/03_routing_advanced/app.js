import express from "express";
import apiRoutes from "./routes/index.js";



export function createApp() {
    const app = express();
    //recuperer le Body JSON
    app.use(express.json())

    //Utiliser le router:
    app.use('/api/v1/', apiRoutes);

    return app;
}