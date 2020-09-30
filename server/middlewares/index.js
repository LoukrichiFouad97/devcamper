import { requireSignin } from "./requireSignin";
import { errorHandler } from "./error";

export const middlewares = {
	requireSignin,
	errorHandler,
};
