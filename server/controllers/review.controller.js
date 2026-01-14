import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/async.js";
import { Review } from "../models/review.model.js";
import { Bootcamp } from "../models/Bootcamp.model.js";

/**
 * @desc    Get reviews (all or via advancedResults)
 * @route   GET /api/v1/reviews
 * @route   GET /api/v1/bootcamps/:bootcampid/reviews
 * @access  Private
 */
export const getReviews = asyncHandler(async (req, res) => {
	res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single review
 * @route   GET /api/v1/reviews/:reviewId
 * @access  Public
 */
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

/**
 * @desc    Create review for bootcamp
 * @route   POST /api/v1/bootcamps/:bootcampid/reviews
 * @access  Private (user/admin)
 */
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

/**
 * @desc    Update review
 * @route   PUT /api/v1/reviews/:reviewId
 * @access  Private (owner/admin)
 */
export const updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.reviewId);
	if (!review) {
		return next(
			new ErrorResponse(
				`there is no review with id ${req.params.reviewId}`,
				404
			)
		);
	}

	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not authorized to update this review`,
				403
			)
		);
	}

	review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, review });
});

/**
 * @desc    Delete review
 * @route   DELETE /api/v1/reviews/:reviewId
 * @access  Private (owner/admin)
 */
export const deleteReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.reviewId);
	if (!review) {
		return next(
			new ErrorResponse(
				`there is no review with id ${req.params.reviewId}`,
				404
			)
		);
	}

	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not authorized to delete this review`,
				403
			)
		);
	}

	await review.deleteOne();
	res.status(200).json({ success: true, data: {} });
});
