import express from "express";

import { controllers } from "../controllers";
import { courseRoute } from "./courses.route";
import { middlewares } from "../middlewares";
import { Bootcamp } from "../models/Bootcamp.model";

export const bootcampsRoute = function () {
	const apiRoute = express.Router();
	const controller = controllers.bootcampController();

	apiRoute.use("/:bootcampid/courses", courseRoute());

	// @desc 		Get a bootcamp within a specific distance
	// @route		GET /api/v1/bootcamps/radius/:zipcode/:distance
	// access		Private
	apiRoute
		.route("/radius/:zipcode/:distance")
		.get(controller.getBootcampInRadius);

	// @desc 		Get all bootcamps and creates a new one
	// @route		GET /api/v1/bootcamps
	// @route		POST /api/v1/bootcamps
	// @access	Public
	apiRoute
		.route("/")
		.get(
			middlewares.advancedResults(Bootcamp, "course"),
			controller.getBootcamps
		)
		.post(controller.createBootcamp);

	// @desc 		Read, Update and Delete bootcamp
	// @route		GET /api/v1/bootcamps/:bootcampId
	// @route		PUT /api/v1/bootcamps/:bootcampId
	// @route		DELETE /api/v1/bootcamps/:bootcampId
	// @access	Private
	apiRoute
		.route("/:bootcampId")
		.get(controller.getBootcamp)
		.put(controller.updateBootcamp)
		.delete(controller.deleteBootcamp);

	return apiRoute;
};
