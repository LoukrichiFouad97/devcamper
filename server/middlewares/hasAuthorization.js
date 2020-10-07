import { ErrorResponse } from "../utils/errorResponse";

export const hasAuthorization = (...roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return next(
			new ErrorResponse(`User role ${req.user.role} is not authorized`, 403)
		);
	}
	next();
};
