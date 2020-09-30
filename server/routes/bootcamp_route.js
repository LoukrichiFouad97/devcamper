import express from "express";

import { controllers } from "../controllers";

export const bootcampsRoute = function () {
	const apiRoute = express.Router();
	const bootcampController = controllers.bootcampController();

	// @desc 		Get all botcamps and creates a new one
	// @route		/api/v1/bootcamps
	// @access	Public
	apiRoute
		.route("/")
		.get(bootcampController.getAllBootcamps)
		.post(bootcampController.createBootcamp);

	// @desc 		Read, Update and Delete bootcamp
	// @route		/api/v1/bootcamps/:bootcampId
	// @access	Private
	apiRoute
		.route("/:bootcampId")
		.get(bootcampController.getBootcamp)
		.put(bootcampController.updateBootcamp)
		.delete(bootcampController.deleteBootcamp);

	return apiRoute;
};
