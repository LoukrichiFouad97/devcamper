import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import color from "colors";
import mongoose from "mongoose";
import { config } from "./config/config.js";
import { Bootcamp } from "./models/Bootcamp.model.js";
import { Course } from "./models/course.model.js";
import { User } from "./models/user.model.js";
import { Review } from "./models/review.model.js";

import dotenv from "dotenv";

dotenv.config();

// connect to db (align with app db config)
const dbUrl = process.env.MONGO_URI || config.db.url;
mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});
console.log(`Seeder connected to: ${dbUrl}`.cyan.underline.bold);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "_data");
const bootcamps = JSON.parse(
	fs.readFileSync(path.join(dataDir, "bootcamps.json"))
);
const courses = JSON.parse(
	fs.readFileSync(path.join(dataDir, "courses.json"))
);
const users = JSON.parse(fs.readFileSync(path.join(dataDir, "users.json")));
const reviews = JSON.parse(
	fs.readFileSync(path.join(dataDir, "reviews.json"))
);

// Import into db
const importData = async () => {
	try {
		// Clean database before inserting date
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();

		// Insert data
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
		await Review.create(reviews);
		console.log("Data imported...".green.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

// Delete from db
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log("Data Deleted...".red.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
