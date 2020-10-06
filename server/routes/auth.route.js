import express from "express";

import { controllers } from "../controllers";
import { requireSignin } from "../middlewares/requireSignin";

export const authRoute = function () {
	const apiRoute = express.Router();
	const controller = controllers.authController();
	/**
	 * @desc 		Creates a new user in database
	 * @route		POST /api/v1/auth/register
	 * @access	Public
	 */
	apiRoute.route("/register").post(controller.register);

	/**
	 * @desc 		Logs in already registered users
	 * @route		POST /api/v1/auth/login
	 * @access	Public
	 */
	apiRoute.post("/login", controller.login);

	/**
	 * @desc 		Gets the current logged in user
	 * @route		POST /api/v1/auth/me
	 * @access	Private
	 */
	apiRoute.post("/me", requireSignin, controller.getCurrentUser);

	return apiRoute;
};
