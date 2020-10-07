import { asyncHandler } from "../middlewares/async";
import { ErrorResponse } from "../utils/errorResponse";
import { User } from "../models/user.model";
import { config } from "../config/config";

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

export const getCurrentUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		user,
	});
});

export const logOut = asyncHandler(async (req, res, next) => {
	res.cookies("token", "");
});
