import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from "path";
import cookieParser from "cookie-parser";

import { config } from "./config/config";
import { loaders } from "./loaders";
import { errorHandler } from "./middlewares/error";

dotenv.config();
const app = express();

app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
// Loaders
loaders(app);

// Middlewares
app.use(errorHandler);

if (config.env === "dev") {
	app.use(morgan("dev"));
}

if (!config.jwt.secret) {
	console.log();
	process.exit(1);
}

const PORT = config.port || 8080;
const server = app.listen(PORT, () =>
	console.log(`Server started at ${PORT}`.yellow.bold)
);

process.on("unhandledRejection", (err) => {
	console.log(`Error: ${err}`.red.bold);
	server.close(() => process.exit(1));
});
