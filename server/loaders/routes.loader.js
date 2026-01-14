import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "js-yaml";
import swaggerUi from "swagger-ui-express";

import { authRoute } from "../routes/auth.route.js";
import { bootcampRoute } from "../routes/bootcamp.route.js";
import { courseRoute } from "../routes/courses.route.js";
import { userRoute } from "../routes/user.route.js";
import { reviewRoute } from "../routes/review.route.js";
import { ErrorResponse } from "../utils/errorResponse.js";

export default (app) => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const swaggerPath = path.join(__dirname, "../swagger.yaml");
	let swaggerDoc = {};
	try {
		swaggerDoc = YAML.load(fs.readFileSync(swaggerPath, "utf8"));
	} catch (err) {
		console.log("Failed to load swagger.yaml", err.message);
	}

	app.use(
		"/api/docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerDoc, { explorer: true })
	);

	app.use("/api/v1/bootcamps", bootcampRoute);
	app.use("/api/v1/courses", courseRoute);
	app.use("/api/v1/auth", authRoute);
	app.use("/api/v1/users", userRoute);
	app.use("/api/v1/reviews", reviewRoute);
	app.all("*", (err, req, res, next) => {
		return next(
			new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404)
		);
	});
};
