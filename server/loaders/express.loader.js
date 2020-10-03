import bodyParser from "body-parser";
import express from "express";
import compression from "compression";
import helmet from "helmet";

export default (app) => {
	// app.use(bodyParser.json());
	// app.use(bodyParser.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(compression());
	app.use(helmet());
};
