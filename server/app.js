import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { config } from "./config/config";
import { mongooseLoader } from "./loaders";

dotenv.config();
const app = express();
mongooseLoader()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send(config.jwt.secret);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, (err) => {
	if (err) throw Error(err);
	console.log(`Server started at ${PORT}`);
	console.log(config.jwt.secret);
});
