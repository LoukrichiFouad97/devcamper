import express from "express";

import { getUsers } from "../controllers/user.controller";

export const userRoute = express.Router();

userRoute.route("/").get(getUsers);


