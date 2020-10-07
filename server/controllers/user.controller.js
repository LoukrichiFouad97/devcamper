import { asyncHandler } from "../middlewares/async";
import { User } from "../models/user.model";
import { ErrorResponse } from "../utils/errorResponse";

export const getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find();
	if (!users) return next(new ErrorResponse("there is no users in db", 404));
	res.status(200).json({
		success: true,
		count: users.length,
		users,
	});
});
