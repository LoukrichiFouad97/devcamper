import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please add a name"],
		},
		email: {
			type: String,
			required: [true, "Please add an email"],
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please add a valid email",
			],
		},
		role: {
			type: String,
			enum: ["user", "publisher"],
			default: "user",
		},
		password: {
			type: String,
			required: [true, "Please add a password"],
			minlength: 6,
			select: false,
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		confirmEmailToken: String,
		isEmailConfirmed: {
			type: Boolean,
			default: false,
		},
		twoFactorCode: String,
		twoFactorCodeExpire: Date,
		twoFactorEnable: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods = {
	getToken: function () {
		return jwt.sign({ id: this._id }, config.jwt.secret, {
			expiresIn: config.jwt.expire,
		});
	},
	matchPassword: async function (enteredPassword) {
		return await bcrypt.compare(enteredPassword, this.password);
	},
};

export const User = mongoose.model("User", UserSchema);
