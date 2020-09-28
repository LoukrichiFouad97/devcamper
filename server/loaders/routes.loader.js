import * as routes from "../routes";

export default (app) => {
	app.use("/api/bootcamps", routes.bootcampRoute);
	app.use("/api/courses", routes.coursesRoute);
	app.use("/api/reviews", routes.reviewsRoute);
	app.use("/api/users", routes.usersRoute);
	app.use("/api/auth", routes.authRoute);
};
