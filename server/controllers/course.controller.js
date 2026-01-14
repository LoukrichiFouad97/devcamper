import { ErrorResponse } from "../utils/errorResponse.js";
import { Course } from "../models/course.model.js";
import { asyncHandler } from "../middlewares/async.js";
import { Bootcamp } from "../models/Bootcamp.model.js";

/**
 * @desc    Get all courses or courses for a bootcamp
 * @route   GET /api/v1/courses
 * @route   GET /api/v1/bootcamps/:bootcampid/courses
 * @access  Private
 */
export const getCourses = asyncHandler(async (req, res) => {
	if (req.params.bootcampid) {
		const courses = await Course.find({ bootcamp: req.params.bootcampid });
		res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

/**
 * @desc    Get single course by id
 * @route   GET /api/v1/courses/:courseid
 * @access  Public
 */
export const getCourse = asyncHandler(async (req, res) => {
	const course = await Course.findById(req.params.courseid).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!course) {
		return next(
			new ErrorResponse(
				`there is no course with id ${req.params.courseid}`,
				404
			)
		);
	}

	res.status(200).json({
		success: true,
		course,
	});
});

/**
 * @desc    Create course for bootcamp
 * @route   POST /api/v1/bootcamps/:bootcampid/courses
 * @access  Private (publisher/admin)
 */
export const createCourse = asyncHandler(async (req, res, next) => {
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

	// Check if user is authorized to update the course
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not authorized to update this course`,
				404
			)
		);
	}

	const course = await Course.create(req.body);

	res.status(200).json({
		success: true,
		course,
	});
});

/**
 * @desc    Update course
 * @route   PUT /api/v1/courses/:courseid
 * @access  Private (publisher/admin)
 */
export const updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.courseid);
	if (!course) {
		return next(
			new ErrorResponse(
				`course not found with this id ${req.params.courseid}`,
				404
			)
		);
	}

	// Check if user is authorized to update the course
	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not authorized to update this course`,
				404
			)
		);
	}

	course = await Course.findByIdAndUpdate(req.params.courseid, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		course,
	});
});

/**
 * @desc    Delete course
 * @route   DELETE /api/v1/courses/:courseid
 * @access  Private (publisher/admin)
 */
export const deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.courseid);
	if (!course) {
		return next(
			new ErrorResponse(
				`course not found with this id ${req.params.courseid}`,
				404
			)
		);
	}

	// Check if user is authorized to update the course
	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not authorized to update this course`,
				404
			)
		);
	}

	await course.deleteOne();

	res.status(200).json({
		success: true,
		data: {},
	});
});
