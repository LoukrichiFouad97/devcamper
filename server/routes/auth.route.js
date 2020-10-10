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

/**
 * @desc    Logs out users
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
authRoute.get("/logout", authController.logOut);

/**
 * @desc    Generates a reset password token
 * @route   POST /api/v1/auth/forgotpassword
 * @access  Public
 */
authRoute.post("/forgotpassword", authController.forgotPassoword);

/**
 * @desc    Reset password
 * @route   PUT /api/v1/auth/resetpassword/:resettoken
 * @access  Public
 */
authRoute.put("/resetpassword/:resettoken", authController.resetToken);

/**
 * @desc    Update user email and name
 * @route   PUT /api/v1/auth/updatedetails
 * @access  Private
 */
authRoute.put("/updatedetails", requireSignin, authController.updateDetails);

/**
 * @desc    Update user password
 * @route   PUT /api/v1/auth/updatepassword
 * @access  Private
 */
authRoute.put("/updatepassword", requireSignin, authController.updatePassword);
