import mongooseLoader from "./mongoose.loader.js";
import routesLoader from "./routes.loader.js";
import expressLoader from "./express.loader.js";

export const loaders = (app) => {
	mongooseLoader();
	expressLoader(app);
	routesLoader(app);
};
