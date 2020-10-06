import express from "express";

import { controllers } from "../controllers";

export const authRoute = function () {
	const apiRoute = express.Router();
	const controller = controllers.authController();

	apiRoute.route("/register").post(controller.register);

	return apiRoute;
};
