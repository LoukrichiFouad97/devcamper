import { ErrorResponse } from "../utils/errorResponse";

export const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	console.log(err.stack.red);

	// Mongo bad objectId
	if (err.name === "CastError") {
		const message = `Resource not found with id ${err.value}`;
		error = new ErrorResponse(message, 404);
	}

	// Mongo duplicate key
	if (err.code === "1100") {
		const message = "duplicates found";
		error = new ErrorResponse(message, 400);
	}

	// validation Error
	if (err.name === "ValidationError") {
		const message = Object.values(err.errors).map((v) => v.message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server Error",
	});
};
