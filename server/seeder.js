import fs from "fs";
import color from "colors";
import mongoose from "mongoose";
import { Bootcamp } from "./models/Bootcamp.model";
import { Course } from "./models/course.model";
import { User } from "./models/user.model";

import dotenv from "dotenv";

dotenv.config();

// connect to db
mongoose.connect(process.env.DEV_DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));

// Import into db
const importData = async () => {
	try {
		// await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
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
