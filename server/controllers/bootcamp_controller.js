import _ from "lodash";

// import { ErrorResponse } from "../utils/errorResponse";

import { Bootcamp } from "../models/Bootcamp.model";

export const bootcampController = () => {
	const getAllBootcamps = async (req, res) => {
		try {
			const bootcamp = await Bootcamp.find();
			res
				.status(200)
				.json({ success: true, count: bootcamp.length, data: bootcamp });
		} catch (err) {
			res.status(400).json({ success: false });
		}
	};

	const createBootcamp = async (req, res) => {
		try {
			const bootcamp = await Bootcamp.create(req.body);
			res.status(201).json({ success: true, data: bootcamp });
		} catch (err) {
			res.status(400).json({ success: false, error: err.message });
		}
	};

	const getBootcamp = async (req, res, next) => {
		try {
			const bootcamp = await Bootcamp.findById(req.params.bootcampId);
			if (!bootcamp) return res.status(400).json({ success: false });
			res.status(200).json({ success: true, data: bootcamp });
		} catch (err) {
			// res.status(400).json({ success: false, error: err.message });
			next(err);
		}
	};

	const updateBootcamp = async (req, res) => {
		try {
			let bootcamp = await Bootcamp.findByIdAndUpdate(
				req.params.bootcampId,
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);
			if (!bootcamp) return res.status(400).json({ msg: "bootcamp not found" });
			res.status(200).json({ success: true, updated: bootcamp });
		} catch (error) {
			res.status(400).json({ success: false, error: err.message });
		}
	};

	const deleteBootcamp = async (req, res) => {
		try {
			const bootcamp = await Bootcamp.findByIdAndRemove(req.params.bootcampId);
			if (!bootcamp) return res.status(400).json({ error: "not found" });
			res.status(200).json({ success: true, removed: bootcamp });
		} catch (error) {
			res.status(400).json({ success: false, error: err.message });
		}
	};

	const getBootcampById = async (req, res, next) => {
		try {
			const bootcamp = await Bootcamp.findById(req.params.bootcampId);
			if (!bootcamp) return res.status(400).json({ success: false });
			req.bootcamp = bootcamp;
			next();
		} catch (error) {
			res.status(400).json({ success: false, error: err.message });
		}
	};

	return {
		createBootcamp,
		getAllBootcamps,
		deleteBootcamp,
		getBootcamp,
		updateBootcamp,
		getBootcampById,
	};
};
