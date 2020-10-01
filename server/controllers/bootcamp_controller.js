import _ from "lodash";

import { ErrorResponse } from "../utils/errorResponse";
import { Bootcamp } from "../models/Bootcamp.model";
import { middlewares } from "../middlewares";

export const bootcampController = () => {
	const asyncHandler = middlewares.asyncHandler;

	const getAllBootcamps = asyncHandler(async (req, res) => {
		const bootcamp = await Bootcamp.find();
		res
			.status(200)
			.json({ success: true, count: bootcamp.length, data: bootcamp });
	});

	const createBootcamp = asyncHandler(async (req, res) => {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({ success: true, data: bootcamp });
	});

	const getBootcamp = asyncHandler(async (req, res, next) => {
		const bootcamp = await Bootcamp.findById(req.params.bootcampId);
		if (!bootcamp)
			return next(
				new ErrorResponse(
					`Bootcamp not found with id ${req.params.bootcampId}`,
					404
				)
			);
		res.status(200).json({ success: true, data: bootcamp });
	});

	const updateBootcamp = asyncHandler(async (req, res) => {
		const bootcamp = await Bootcamp.findByIdAndUpdate(
			req.params.bootcampId,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!bootcamp) return res.status(400).json({ msg: "bootcamp not found" });
		res.status(200).json({ success: true, updated: bootcamp });
	});

	const deleteBootcamp = asyncHandler(async (req, res) => {
		const bootcamp = await Bootcamp.findByIdAndRemove(req.params.bootcampId);
		if (!bootcamp) return res.status(400).json({ error: "not found" });
		res.status(200).json({ success: true, removed: bootcamp });
	});

	return {
		createBootcamp,
		getAllBootcamps,
		deleteBootcamp,
		getBootcamp,
		updateBootcamp,
	};
};
