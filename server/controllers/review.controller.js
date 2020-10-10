import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../middlewares/async";
import { Review } from "../models/review.model";
import { Bootcamp } from "../models/Bootcamp.model";

export const getReviews = asyncHandler(async (req, res) => {
	res.status(200).json(res.advancedResults);
});

export const getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.reviewId).populate({
		path: "Bootcamp",
		select: "name description",
	});
	if (!review)
		return next(
			new ErrorResponse(
				`there is no review with id ${req.params.reviewId}`,
				404
			)
		);

	res.status(200).json({
		success: true,
		review,
	});
});

export const createReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampid;
	req.body.user = req.user.id;

	// find bootcamp by ID
	const bootcamp = await Bootcamp.findById(req.params.bootcampid);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`bootcamp not found with this id ${req.params.bootcampid}`,
				404
			)
		);
	}

	const review = await Review.create(req.body);

	res.status(201).json({
		success: true,
		review,
	});
});
