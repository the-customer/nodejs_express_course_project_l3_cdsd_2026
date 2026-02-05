import {
    createApp
} from "./app.js";
import {
    config
} from "../01_setup/config.js";

const app = createApp();

app.listen(config.port, () => {
    console.log(`Chapter 02 running on http://localhost:${config.port}`)
})