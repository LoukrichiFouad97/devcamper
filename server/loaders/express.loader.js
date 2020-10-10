import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import mongoSanitizer from "express-mongo-sanitize";
import limiter from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import path from "path";

export default (app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(compression());
	app.use(fileUpload());
	app.use(express.static(path.join(__dirname, "public")));
	app.use(cookieParser());
	app.use(cors());
	app.use(helmet());
	app.use(xss());
	app.use(hpp());
	app.use(mongoSanitizer());
	app.use(
		limiter({
			windowMs: 10 * 60 * 1000,
			max: 100,
			message: "Max Number of requests exceeded, Please try again later",
		})
	);
};
