import express from "express";

import * as bootcampController from "../controllers/bootcamp.controller.js";
import { courseRoute } from "./courses.route.js";
import { reviewRoute } from "./review.route.js";
import { requireSignin } from "../middlewares/requireSignin.js";
import { advancedResults } from "../middlewares/advancedResults.js";
import { hasAuthorization } from "../middlewares/hasAuthorization.js";
import { Bootcamp } from "../models/Bootcamp.model.js";

export const bootcampRoute = express.Router();

// nested routes
bootcampRoute.use("/:bootcampid/courses", courseRoute);
bootcampRoute.use("/:bootcampid/reviews", reviewRoute);

/**
 * @desc 		Get a bootcamp within a specific distance
 * @route		GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access		Private
 */
bootcampRoute
	.route("/radius/:zipcode/:distance")
	.get(requireSignin, bootcampController.getBootcampInRadius);

/**
 * @desc 		Upload a bootcamp photo
 * @route		PUT /api/v1/bootcamps/:bootcampid/photo
 * @access		Private
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
 * @access		Public for GET, Private for POST
 */
bootcampRoute
	.route("/")
	.get(
		advancedResults(Bootcamp, "course"),
		bootcampController.getBootcamps
	)
	.post(requireSignin, bootcampController.createBootcamp);

/**
 * @desc 		Read, Update and Delete bootcamp
 * @route		GET /api/v1/bootcamps/:bootcampid
 * @route		PUT /api/v1/bootcamps/:bootcampid
 * @route		DELETE /api/v1/bootcamps/:bootcampid
 * @access		Private
 */
bootcampRoute
	.route("/:bootcampid")
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
