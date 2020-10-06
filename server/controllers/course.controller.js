import { ErrorResponse } from "../utils/errorResponse";
import { Course } from "../models/course.model";
import { asyncHandler } from "../middlewares/async";
import { Bootcamp } from "../models/Bootcamp.model";

// @desc 	get all the courses in database
export const getCourses = asyncHandler(async (req, res) => {
	if (req.params.bootcampid) {
		const courses = await Course.find({ bootcamp: req.params.bootcampid });
		res.status(200).json({
			success: true,
			count: courses.length,
			courses,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc 	get a specific course from databas using its ID
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

// @desc 	create a new bootcamp course
export const createCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampid;

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

	const course = await Course.create(req.body);

	res.status(200).json({
		success: true,
		course,
	});
});

// @desc 	update course in database
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

	course = await Course.findByIdAndUpdate(req.params.courseid, req.body);

	res.status(200).json({
		success: true,
		course,
	});
});

// @desc 	delete course from database
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

	await Course.remove();

	res.status(200).json({
		success: true,
		removed: course,
	});
});
