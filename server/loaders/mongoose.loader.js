import mongoose from "mongoose";
import { config } from "../config/config.js";

export default async () => {
	const db = process.env.MONGO_URI || config.db.url;

	await mongoose.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	});
	console.log(`DB connected to: ${db}`.cyan.underline.bold);
};
