import { requireSignin } from "./requireSignin";
import { errorHandler } from "./error";
import { asyncHandler } from "./async";

export const middlewares = {
	requireSignin,
	errorHandler,
	asyncHandler,
};
