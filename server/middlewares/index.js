import { requireSignin } from "./requireSignin";
import { errorHandler } from "./error";
import { asyncHandler } from "./async";
import { advancedResults } from "./advancedResults";

export const middlewares = {
	requireSignin,
	errorHandler,
	asyncHandler,
	advancedResults,
};
