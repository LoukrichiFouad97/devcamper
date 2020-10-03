import express from "express";

import { controllers } from "../controllers";

export const bootcampsRoute = function () {
	const apiRoute = express.Router();
	const controller = controllers.bootcampController();

	// @desc 		Get a bootcamp within a specific distance
	// @route		GET /api/v1/bootcamps/radius/:zipcode/:distance
	// access		Private
	apiRoute
		.route("/radius/:zipcode/:distance")
		.get(controller.getBootcampInRadius);

	// @desc 		Get all bootcamps and creates a new one
	// @route		/api/v1/bootcamps
	// @access	Public
	apiRoute
		.route("/")
		.get(controller.getBootcamps)
		.post(controller.createBootcamp);

	// @desc 		Read, Update and Delete bootcamp
	// @route		/api/v1/bootcamps/:bootcampId
	// @access	Private
	apiRoute
		.route("/:bootcampId")
		.get(controller.getBootcamp)
		.put(controller.updateBootcamp)
		.delete(controller.deleteBootcamp);

	return apiRoute;
};
