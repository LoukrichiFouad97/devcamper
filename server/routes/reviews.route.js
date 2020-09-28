import express from "express";

export const reviewsRoute = express.Router();

reviewsRoute.get("/", (req, res) => {
	res.send("reviewsRoute");
});
