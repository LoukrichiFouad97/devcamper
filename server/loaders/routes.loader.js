import { routes } from "../routes";

export default (app) => {
	app.use("/api/v1/bootcamps", routes.bootcampsRoute());
	app.use("/api/v1/courses", routes.courseRoute());
	app.use("/api/v1/auth", routes.authRoute());
	app.all("*", (err, req, res, next) => {
		res.status(404).json({
			status: "fail",
			message: `Can't find ${req.originalUrl} on this server!`,
		});
	});
};
