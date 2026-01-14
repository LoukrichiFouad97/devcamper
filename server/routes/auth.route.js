import express from "express";
import passport from "passport";

import * as authController from "../controllers/auth.controller.js";
import { requireSignin } from "../middlewares/requireSignin.js";

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
authRoute.get("/me", requireSignin, authController.getCurrentUser);

/**
 * @desc    Logs out users
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
authRoute.post("/logout", authController.logOut);

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

/**
 * @desc    Google OAuth - Initiates Google login
 * @route   GET /api/v1/auth/google
 * @access  Public
 */
authRoute.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

/**
 * @desc    Google OAuth Callback
 * @route   GET /api/v1/auth/google/callback
 * @access  Public
 */
authRoute.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login", session: false }),
	authController.googleCallback
);

/**
 * @desc    GitHub OAuth - Initiates GitHub login
 * @route   GET /api/v1/auth/github
 * @access  Public
 */
authRoute.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"], session: false })
);

/**
 * @desc    GitHub OAuth Callback
 * @route   GET /api/v1/auth/github/callback
 * @access  Public
 */
authRoute.get(
	"/github/callback",
	passport.authenticate("github", { failureRedirect: "/login", session: false }),
	authController.githubCallback
);

