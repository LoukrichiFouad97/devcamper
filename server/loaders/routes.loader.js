import { authRoute } from "../routes/auth.route";
import { bootcampRoute } from "../routes/bootcamp.route";
import { courseRoute } from "../routes/courses.route";
import { userRoute } from "../routes/user.route";
import { reviewRoute } from "../routes/review.route";
import { ErrorResponse } from "../utils/errorResponse";

export default (app) => {
	app.use("/api/v1/bootcamps", bootcampRoute);
	app.use("/api/v1/courses", courseRoute);
	app.use("/api/v1/auth", authRoute);
	app.use("/api/v1/users", userRoute);
	app.use("/api/v1/reviews", reviewRoute);
	app.all("*", (err, req, res, next) => {
		return next(
			new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404)
		);
	});
};
