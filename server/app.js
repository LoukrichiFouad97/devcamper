import express from "express";
import dotenv from "dotenv";
import "colors";
import morgan from "morgan";

import { config } from "./config/config.js";
import { loaders } from "./loaders/index.js";
import { errorHandler } from "./middlewares/error.js";

dotenv.config();
const app = express();

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

// Export app for testing; start server only in non-test environments
let server = null;
if (config.env !== "test") {
	server = app.listen(PORT, () => console.log(`Server started at ${PORT}`.yellow.bold));

	process.on("unhandledRejection", (err) => {
		console.log(`Error: ${err}`.red.bold);
		server.close(() => process.exit(1));
	});
}

export default app;
