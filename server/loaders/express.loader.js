import express from "express";
import compression from "compression";
import helmet from "helmet";

export default (app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(compression());
	app.use(helmet());
};
