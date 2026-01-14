import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "./async.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { User } from "../models/user.model.js";

export const requireSignin = asyncHandler(async (req, res, next) => {
	let token;

	// Prefer Authorization header, else fall back to signed cookie
	if (req.headers.authorization?.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies?.token) {
		token = req.cookies.token;
	}

	if (!token) {
		return next(
			new ErrorResponse("No authorization token was found or invalid token", 401)
		);
	}

	try {
		const decoded = jwt.verify(token, config.jwt.secret);
		const user = await User.findById(decoded.id);
		if (!user) {
			return next(new ErrorResponse("Not authorized to access this route", 401));
		}
		req.user = user;
		next();
	} catch (error) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}
});
