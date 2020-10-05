import express from "express";

import { controllers } from "../controllers";

export const courseRoute = function () {
  const apiRoute = express.Router({ mergeParams: true });
  const controller = controllers.coursesController();

  /**
   * @desc 		Get all courses and each bootcamp courses
   * @route 	GET /api/v1/courses
   * @route 	GET /api/v1/bootcamps/:bootcampid/courses
   * @access	Private
   */
  apiRoute.route("/").get(controller.getCourses).post(controller.createCourse);

  /**
   * @desc 		Read, Update and Delete course
   * @route		GET /api/v1/courses/:courseid
   * @route		PUT /api/v1/courses/:courseid
   * @route		DELETE /api/v1/courses/:courseid
   * @access	Private
   */
  apiRoute
    .route("/:courseid")
    .get(controller.getCourse)
    .put(controller.updateCourse)
    .delete(controller.deleteCourse);
  return apiRoute;
};
