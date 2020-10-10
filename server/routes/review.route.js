import express from "express";

import { advancedResults } from "../middlewares/advancedResults";
import { Review } from "../models/review.model";
import * as reviewController from "../controllers/review.controller";
import { requireSignin } from "../middlewares/requireSignin";
import { hasAuthorization } from "../middlewares/hasAuthorization";

export const reviewRoute = express.Router({ mergeParams: true });

/**
 * @desc 		Get all the reviews
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
 * @desc 		Read, Update and delete reviews
 * @route 	GET 	 /api/v1/reviews/:reviewId
 * @route 	PUT 	 /api/v1/reviews/:reviewId
 * @route 	DELETE /api/v1/reviews/:reviewId
 * @access	Private
 */
reviewRoute.route("/:reviewId").get(reviewController.getReview);
