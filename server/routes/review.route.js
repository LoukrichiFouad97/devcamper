import express from "express";

import { advancedResults } from "../middlewares/advancedResults.js";
import { Review } from "../models/review.model.js";
import * as reviewController from "../controllers/review.controller.js";
import { requireSignin } from "../middlewares/requireSignin.js";
import { hasAuthorization } from "../middlewares/hasAuthorization.js";

export const reviewRoute = express.Router({ mergeParams: true });

/**
 * @desc 	Get all the reviews
 * @route 	GET /api/v1/reviews
 * @route 	GET /api/v1/bootcamps/:bootcampid/reviews
 * @access	Private
 */
reviewRoute
	.route("/")
	.get(
		advancedResults(Review, {
			path: "bootcamp",
			select: "name description",
		}),
		reviewController.getReviews
	)
	.post(
		requireSignin,
		hasAuthorization("user", "admin"),
		reviewController.createReview
	);

/**
 * @desc 	Read, Update and delete reviews
 * @route 	GET 	 /api/v1/reviews/:reviewId
 * @route 	PUT 	 /api/v1/reviews/:reviewId
 * @route 	DELETE /api/v1/reviews/:reviewId
 * @access	Private
 */
reviewRoute
	.route("/:reviewId")
	.get(reviewController.getReview)
	.put(
		requireSignin,
		hasAuthorization("user", "admin"),
		reviewController.updateReview
	)
	.delete(
		requireSignin,
		hasAuthorization("user", "admin"),
		reviewController.deleteReview
	);
