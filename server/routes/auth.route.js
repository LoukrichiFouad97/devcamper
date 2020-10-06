import express from "express";

import * as authController from "../controllers/auth.controller";
import { requireSignin } from "../middlewares/requireSignin";

export const authRoute = express.Router();
/**
 * @desc 		Creates a new user in database
 * @route		POST /api/v1/auth/register
 * @access	Public
 */
authRoute.route("/register").post(authController.register);

/**
 * @desc 		Logs in already registered users
 * @route		POST /api/v1/auth/login
 * @access	Public
 */
authRoute.post("/login", authController.login);

/**
 * @desc 		Gets the current logged in user
 * @route		POST /api/v1/auth/me
 * @access	Private
 */
authRoute.post("/me", requireSignin, authController.getCurrentUser);