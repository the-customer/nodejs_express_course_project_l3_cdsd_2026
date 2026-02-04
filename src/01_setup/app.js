import express from "express";
import {
    config
} from "./config.js";

export function createApp() {
    const app = express();

    //Routes
    app.get("/", (req, res) => {
        return res.send(`✅ ${config.appName} is running (Chapter 01)`)
    })


    app.get("/health", (req, res) => {
        res.json({
            status: "ok",
            env: config.env,
            chapter: 1,
            time: new Date().toISOString()
        })
    })



    return app;
}