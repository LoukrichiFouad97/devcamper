import express from "express";
import dotenv from "dotenv";
import { config } from "./config/config";
import * as loaders from "./loaders";

dotenv.config();

const app = express();

// loaders
loaders.mongooseLoader();
loaders.routesLoader(app);
loaders.expressLoader(app);

const PORT = config.port || 8080;
app.listen(PORT, () => console.log(`Server started at ${PORT}`));
