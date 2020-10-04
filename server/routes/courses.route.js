import express from "express";

import { controllers } from "../controllers";

export const courseRoute = function () {
	const apiRoute = express.Router({ mergeParams: true });
	const controller = controllers.coursesController();

	apiRoute.route("/").get(controller.getCourses);

	return apiRoute;
};
