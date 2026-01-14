import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import mongoSanitizer from "express-mongo-sanitize";
import limiter from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import { configureGoogleStrategy } from "../config/strategies/googleStrategy.js";
import { configureGitHubStrategy } from "../config/strategies/githubStrategy.js";
import cacheMiddleware from "../middlewares/cache.js";
import responseEnhancer from "../middlewares/responseEnhancer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (app) => {
	// behind proxies (e.g., local reverse proxies), trust first proxy for rate limiting
	app.set('trust proxy', 1);
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(compression());
	app.use(fileUpload());
	app.use(express.static(path.join(__dirname, "../public")));
	app.use(cookieParser());
	app.use(
		cors({
			origin: [
				'http://localhost:3000',
				'http://127.0.0.1:3000',
				'http://localhost:3001',
				'http://127.0.0.1:3001',
				'http://localhost:3002',
				'http://127.0.0.1:3002',
				'http://localhost:5173',
				'http://127.0.0.1:5173',
			],
			credentials: true,
		})
	);
	app.use(helmet());
	app.use(xss());
	app.use(hpp());
	app.use(mongoSanitizer());
	// Apply relaxed rate limiting in dev; stricter in prod
	const isProd = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';
	const rateLimitOptions = isProd
		? {
			windowMs: 10 * 60 * 1000,
			max: 100,
			standardHeaders: true,
			legacyHeaders: false,
			message: "Max Number of requests exceeded, Please try again later",
		}
		: {
			windowMs: 60 * 1000,
			max: 1000,
			skipSuccessfulRequests: true,
			standardHeaders: false,
			legacyHeaders: false,
		};
	app.use(limiter(rateLimitOptions));

	app.use(passport.initialize());
	app.use(cacheMiddleware);
	app.use(responseEnhancer);

	configureGoogleStrategy(passport);
	configureGitHubStrategy(passport);
};