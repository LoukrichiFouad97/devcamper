import mongoose from "mongoose";
import { config } from "../config/config";

export default () => {
	const db = config.db.url;
	try {
		mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log(`DB connected to: ${db}`);
	} catch (error) {
		throw Error(error);
	}
};
