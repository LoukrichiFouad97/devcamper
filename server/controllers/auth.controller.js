import { middlewares } from "../middlewares";
import { ErrorResponse } from "../utils/errorResponse";

export const authController = () => {
	const asyncHandler = middlewares.asyncHandler;
	const register = asyncHandler((req, res, next) => {
		res.send("controller works good");
	});

	return {
		register,
	};
};
