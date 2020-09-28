import express from "express";

export const userController = express.Router();

userController.get("/", (req, res) => {
	res.send("test from user controller");
});
