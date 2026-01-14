import { asyncHandler } from "../middlewares/async.js";
import { User } from "../models/user.model.js";
import { ErrorResponse } from "../utils/errorResponse.js";

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find();
	if (!users) return next(new ErrorResponse("there is no users in db", 404));
	res.status(200).json({
		success: true,
		count: users.length,
		data: users,
	});
});

/**
 * @desc    Get single user
 * @route   GET /api/v1/users/:userId
 * @access  Private/Admin
 */
export const getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.userId);
	if (!user)
		return next(
			new ErrorResponse(`User with ID ${req.params.userId} no registered`, 404)
		);

	res.status(200).json({
		success: true,
		data: user,
	});
});

/**
 * @desc    Create user (admin panel)
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
export const createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);
	if (!user) return next(new ErrorResponse(`Can't create a new user`, 404));

	res.status(200).json({
		success: true,
		data: user,
	});
});

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:userId
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
		new: true,
		runValidators: true,
	});
	if (!user) return next(new ErrorResponse(`couldn't update user`, 400));

	res.status(200).json({
		success: true,
		data: user,
	});
});

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:userId
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.userId);
	if (!user) return next(new ErrorResponse(`can't remove user`, 400));
	await user.deleteOne();
	res.status(200).json({
		success: true,
		data: {},
	});
});
