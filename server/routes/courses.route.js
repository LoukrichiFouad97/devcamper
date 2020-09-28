import express from "express";

export const coursesRoute = express.Router();

coursesRoute.get("/", (req, res) => {
	res.send("coursesRoute");
});
