import express from "express";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import mongoSanitizer from "express-mongo-sanitize";
import path from "path";

export default (app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(compression());
	app.use(helmet());
	app.use(fileUpload());
	app.use(express.static(path.join(__dirname, "public")));
	app.use(cookieParser());
	app.use(
		mongoSanitizer({
			replaceWith: "*",
		})
	);
};
