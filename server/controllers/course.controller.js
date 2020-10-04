import { ErrorResponse } from "../utils/errorResponse";
import { Course } from "../models/course.model";
import { middlewares } from "../middlewares";

export const coursesController = () => {
	const asyncHandler = middlewares.asyncHandler;

	const getCourses = asyncHandler(async (req, res) => {
		let query;

		if (req.params.bootcampid) {
			query = Course.find({ bootcamp: req.params.bootcampid });
		} else {
			query = Course.find();
		}

		const courses = await query;
		res.status(200).json({
			success: true,
			count: courses.length,
			courses,
		});
	});

	return { getCourses };
};
