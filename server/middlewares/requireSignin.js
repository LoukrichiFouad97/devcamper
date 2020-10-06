import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "./async";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "../models/user.model";

export const requireSignin = asyncHandler(async (req, res, next) => {
	let token = req.headers.authorization;
	console.log("token", token);
	try {
		if (!token || !token.startsWith("Bearer")) {
			return next(
				new ErrorResponse("Not authorized to access this route", 401)
			);
		} else {
			token = token.split(" ")[1];
		}

		// get token and verify token valid or not
		const decoded = jwt.verify(token, config.jwt.secret);
		console.log("decoded", decoded);
		req.user = await User.findById(decoded.id);
		next();
	} catch (error) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}
});
