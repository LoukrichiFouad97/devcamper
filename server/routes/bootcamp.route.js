import express from "express";

export const bootcampRoute = express.Router();

bootcampRoute.get("/", (req, res) => {
	res.send("bootcampRoute");
});
