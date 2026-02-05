import express from "express";
import {
    router
} from "./routes.js";


export function createApp() {
    const app = express();
    //recuperer le Body JSON
    app.use(express.json())

    //Utiliser le router:
    app.use("/", router)

    return app;
}