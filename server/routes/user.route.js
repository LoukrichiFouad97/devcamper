import express from "express";

import * as userController from "../controllers/user.controller";
import { requireSignin } from "../middlewares/requireSignin";
import { hasAuthorization } from "../middlewares/hasAuthorization";

export const userRoute = express.Router();

// Require sign in and Check admin middlwares
userRoute.use(requireSignin);
userRoute.use(hasAuthorization("admin"));

// @desc    get all users. and creates a new user
// @route   GET    /api/v1/users
// @route   POST   /api/v1/users
// @access  Private/Admin
userRoute.route("/").get(userController.getUsers).post(userController.createUser);

// @desc    Read, Update and Delete Users (Admin)
// @route   GET    /api/v1/users/:userId
// @route   PUT    /api/v1/users/:userId
// @route   DELETE /api/v1/users/:userId
// @access  Private/Admin
userRoute
	.route("/:userId")
	.get(userController.getUser)
	.put(userController.updateUser)
	.delete(userController.deleteUser);
