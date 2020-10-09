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

export const getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.userId);
	if (!user)
		return next(
			new ErrorResponse(`User with ID ${req.params.userId} no registered`, 404)
		);

	res.status(200).json({
		success: true,
		user,
	});
});

export const createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);
	if (!user) return next(new ErrorResponse(`Can't create a new user`, 404));

	res.status(200).json({
		success: true,
		createdUser: user,
	});
});

export const updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
		new: true,
		runValidators: true,
	});
	if (!user) return next(new ErrorResponse(`couldn't update user`, 400));

	res.status(200).json({
		success: true,
		updatedUser: user,
	});
});

export const deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndRemove(req.params.userId);
	if (!user) return next(new ErrorResponse(`can't remove user`, 400));

	res.status(200).json({
		success: true,
		removedUser: user,
	});
});
