import mongooseLoader from "./mongoose.loader";
import routesLoader from "./routes.loader";
import expressLoader from "./express.loader";


export const loaders = (app) => {
	mongooseLoader();
	expressLoader(app);
	routesLoader(app);
};
