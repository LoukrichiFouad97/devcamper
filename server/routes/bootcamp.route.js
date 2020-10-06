import express from "express";

import * as bootcampController from "../controllers/bootcamp.controller";
import { courseRoute } from "./courses.route";
import { requireSignin } from "../middlewares/requireSignin";
import { advancedResults } from "../middlewares/advancedResults";
import { hasAuthorization } from "../middlewares/hasAuthorization";
import { Bootcamp } from "../models/Bootcamp.model";

export const bootcampRoute = express.Router();

bootcampRoute.use("/:bootcampid/courses", courseRoute);

// @desc 		Get a bootcamp within a specific distance
// @route		GET /api/v1/bootcamps/radius/:zipcode/:distance
// access		Private
bootcampRoute
	.route("/radius/:zipcode/:distance")
	.get(bootcampController.getBootcampInRadius);

// @desc 		Get a bootcamp within a specific distance
// @route		GET /api/v1/bootcamps/radius/:zipcode/:distance
// access		Private
bootcampRoute
	.route("/:bootcampid/photo")
	.put(bootcampController.bootcampPhotoUpload);

// @desc 		Get all bootcamps and creates a new one
// @route		GET /api/v1/bootcamps
// @route		POST /api/v1/bootcamps
// @access	Public
bootcampRoute
	.route("/")
	.get(
		requireSignin,
		advancedResults(Bootcamp, "course"),
		bootcampController.getBootcamps
	)
	.post(bootcampController.createBootcamp);

// @desc 		Read, Update and Delete bootcamp
// @route		GET /api/v1/bootcamps/:bootcampId
// @route		PUT /api/v1/bootcamps/:bootcampId
// @route		DELETE /api/v1/bootcamps/:bootcampId
// @access	Private
bootcampRoute
	.route("/:bootcampId")
	.get(requireSignin, hasAuthorization("admin"), bootcampController.getBootcamp)
	.put(bootcampController.updateBootcamp)
	.delete(bootcampController.deleteBootcamp);
