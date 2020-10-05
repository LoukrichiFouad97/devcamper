import { ErrorResponse } from "../utils/errorResponse";
import { Course } from "../models/course.model";
import { middlewares } from "../middlewares";
import { Bootcamp } from "../models/Bootcamp.model";

export const coursesController = () => {
	const asyncHandler = middlewares.asyncHandler;

	// @desc 	get all the courses in database
	const getCourses = asyncHandler(async (req, res) => {
		let query;

		// query customization
		if (req.params.bootcampid) {
			query = Course.find({ bootcamp: req.params.bootcampid });
		} else {
			query = Course.find().populate({
				path: "bootcamp",
				select: "name description",
			});
		}

		const courses = await query;
		res.status(200).json({
			success: true,
			count: courses.length,
			courses,
		});
	});

	// @desc 	get a specific course from databas using its ID
	const getCourse = asyncHandler(async (req, res) => {
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
	const createCourse = asyncHandler(async (req, res, next) => {
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
	const updateCourse = asyncHandler(async (req, res, next) => {
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
	const deleteCourse = asyncHandler(async (req, res, next) => {
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
	return { getCourses, getCourse, createCourse, updateCourse, deleteCourse };
};
