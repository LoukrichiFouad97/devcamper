import { ErrorResponse } from "../utils/errorResponse";

export const hasAuthorization = (...roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return next(
			new ErrorResponse("Forbidden! you are not authorized to access", 403)
		);
	}
	next();
};
