import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { config } from "./config/config";
import { loaders } from "./loaders";
import { middlewares } from "./middlewares";
import morgan from "morgan";

dotenv.config();
const app = express();

// Loaders
loaders(app);

// Middlewares
app.use(middlewares.errorHandler);

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
