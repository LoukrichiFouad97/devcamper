import crypto from "crypto";

import { asyncHandler } from "../middlewares/async";
import { ErrorResponse } from "../utils/errorResponse";
import { User } from "../models/user.model";
import { config } from "../config/config";
import { sendEmail } from "../utils/sendEmail";

export const register = asyncHandler(async (req, res) => {
	const user = await User.create(req.body);
	if (!user) return new ErrorResponse("can't create user", 404);

	sendTokenResponse(user, 200, res);
});

export const login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// validate email and password
	if (!email || !password) {
		return next(new ErrorResponse("fields must not left empty", 400));
	}

	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return next(new ErrorResponse(`there is no user with ${req.body.id}`, 404));
	}

	// check if password is matched
	const isMatch = await user.matchPassword(password);
	if (!isMatch) return next(new ErrorResponse("Invalid credentials", 401));

	sendTokenResponse(user, 200, res);
});

export const getCurrentUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		user,
	});
});

export const logOut = asyncHandler(async (req, res, next) => {
	res.cookie("token", "");
	res.status(200).json({
		success: true,
		msg: "Signed Out successfully!",
	});
});

export const forgotPassoword = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) return next(new ErrorResponse(`${email} not registered`, 404));

	// Get a reset token
	const resetToken = user.getResetToken();

	await user.save({ validateBeforeSave: false });

	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/resetpassword/${resetToken}`;

	const message = `You are receiving this email because you or (someone else) has requested the reset password. please send a PUT request to \n\n ${resetUrl}`;

	try {
		sendEmail({
			email: user.email,
			subject: "Reset password Token",
			message,
		});
		res.status(200).json({
			success: true,
			data: "email sent",
		});
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new ErrorResponse("email can't be send", 500));
	}

	res.status(200).json({
		success: true,
		resetToken,
	});
});

export const resetToken = asyncHandler(async (req, res, next) => {
	// hash the forgot password token provided in the reset url
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resettoken)
		.digest("hex");

	console.log(resetPasswordToken);
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) return next(new ErrorResponse("Invalid token", 400));

	// Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save({ validateBeforeSave: false });

	sendTokenResponse(user, 200, res);
});

export const updateDetails = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		name: req.body.name,
		email: req.body.email,
	};

	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		validateBeforeSave: true,
	});

	res.status(200).json({
		success: true,
		user,
	});
});

export const updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");

	if (!(await user.matchPassword(req.body.currentPassword)))
		return next(new ErrorResponse("Invalid password", 401));

	user.password = req.body.newPassword;
	await user.save();

	sendTokenResponse(user, 200, res);
});

// Get token from model, creates a cookie and sends a response
const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getToken();

	const options = {
		expires: new Date(
			Date.now() + config.jwt.cookie_expire * 1000 * 24 * 60 * 60
		),
		httpOnly: true,
	};

	if (config.env === "prod") {
		options.secure = true;
	}

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		token,
	});
};
