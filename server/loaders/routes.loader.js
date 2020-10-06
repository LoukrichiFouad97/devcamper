import { authRoute } from "../routes/auth.route";
import { bootcampRoute } from "../routes/bootcamp.route";
import { courseRoute } from "../routes/courses.route";

export default (app) => {
	app.use("/api/v1/bootcamps", bootcampRoute);
	app.use("/api/v1/courses", courseRoute);
	app.use("/api/v1/auth", authRoute);
	app.all("*", (err, req, res, next) => {
		res.status(404).json({
			status: "fail",
			message: `Can't find ${req.originalUrl} on this server!`,
		});
	});
};
