import express from "express";

import * as bootcampController from "../controllers/bootcamp.controller";
import { courseRoute } from "./courses.route";
import { requireSignin } from "../middlewares/requireSignin";
import { advancedResults } from "../middlewares/advancedResults";
import { hasAuthorization } from "../middlewares/hasAuthorization";
import { Bootcamp } from "../models/Bootcamp.model";

export const bootcampRoute = express.Router();

bootcampRoute.use("/:bootcampid/courses", courseRoute);

/**
 * @desc 		Get a bootcamp within a specific distance
 * @route		GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access	Private
 */
bootcampRoute
	.route("/radius/:zipcode/:distance")
	.get(requireSignin, bootcampController.getBootcampInRadius);

/**
 * @desc 		Upload a bootcamp photo
 * @route		PUT /api/v1/bootcamps/:bootcampid/photo
 * @access	Private
 */
bootcampRoute
	.route("/:bootcampid/photo")
	.put(
		requireSignin,
		hasAuthorization("admin", "publisher"),
		bootcampController.bootcampPhotoUpload
	);

/**
 * @desc 		Get all bootcamps and creates a new one
 * @route		GET /api/v1/bootcamps
 * @route		POST /api/v1/bootcamps
 * @access	Public
 */
bootcampRoute
	.route("/")
	.get(
		requireSignin,
		hasAuthorization("admin", "publisher"),
		advancedResults(Bootcamp, "course"),

		bootcampController.getBootcamps
	)
	.post(requireSignin, bootcampController.createBootcamp);

/**
 * @desc 		Read, Update and Delete bootcamp
 * @route		GET /api/v1/bootcamps/:bootcampId
 * @route		PUT /api/v1/bootcamps/:bootcampId
 * @route		DELETE /api/v1/bootcamps/:bootcampId
 * @access	Private
 */
bootcampRoute
	.route("/:bootcampId")
	.get(bootcampController.getBootcamp)
	.put(
		requireSignin,
		hasAuthorization("publisher", "admin"),
		bootcampController.updateBootcamp
	)
	.delete(
		requireSignin,
		hasAuthorization("publisher", "admin"),
		bootcampController.deleteBootcamp
	);
