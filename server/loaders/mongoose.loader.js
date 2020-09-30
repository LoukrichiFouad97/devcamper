import mongoose from "mongoose";
import { config } from "../config/config";

export default async () => {
	const db = config.db.url;

	await mongoose.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	});
	console.log(`DB connected to: ${db}`.cyan.underline.bold);
};
