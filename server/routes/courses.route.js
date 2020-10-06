import express from "express";

import * as courseController from "../controllers/course.controller";
import { advancedResults } from "../middlewares/advancedResults";
import { Course } from "../models/course.model";

export const courseRoute = express.Router({ mergeParams: true });

/**
 * @desc 		Get all courses and each bootcamp courses
 * @route 	GET /api/v1/courses
 * @route 	GET /api/v1/bootcamps/:bootcampid/courses
 * @access	Private
 */
courseRoute
	.route("/")
	.get(
		advancedResults(Course, {
			path: "bootcamp",
			select: "name description",
		}),
		courseController.getCourses
	)
	.post(courseController.createCourse);

/**
 * @desc 		Read, Update and Delete course
 * @route		GET /api/v1/courses/:courseid
 * @route		PUT /api/v1/courses/:courseid
 * @route		DELETE /api/v1/courses/:courseid
 * @access	Private
 */
courseRoute
	.route("/:courseid")
	.get(courseController.getCourse)
	.put(courseController.updateCourse)
	.delete(courseController.deleteCourse);
