import _ from "lodash";

import { ErrorResponse } from "../utils/errorResponse";
import { Bootcamp } from "../models/Bootcamp.model";
import { middlewares } from "../middlewares";
import { geoCoder } from "../utils/geoCoder";

export const bootcampController = () => {
	const asyncHandler = middlewares.asyncHandler;

	const getBootcamps = asyncHandler(async (req, res) => {
		let query;
		const reqQuery = { ...req.query };

		// Remove fields from reqQuery
		const removedFields = ["select", "sort", "page", "limit"];
		removedFields.forEach((param) => delete reqQuery[param]);

		let queryStr = JSON.stringify(reqQuery);
		queryStr = queryStr.replace(
			/\b(lt|lte|gt|gte|in)\b/g,
			(match) => `$${match}`
		);

		query = Bootcamp.find(JSON.parse(queryStr));

		// Select Fields
		if (req.query.select) {
			const fields = req.query.select.split(",").join(" ");
			query = query.select(fields);
		}

		// SortBy
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			query = query.sort(sortBy);
		} else {
			query = query.sort("createdAt");
		}

		// Pagination
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const total = await Bootcamp.countDocuments(); // calculates the total documents in the model

		query = query.skip(startIndex).limit(limit);

		const bootcamp = await query;

		// Pagination result
		const pagintaion = {};

		if (startIndex > 0) {
			pagintaion.prev = {
				page: page - 1,
				limit,
			};
		}

		if (endIndex < total) {
			pagintaion.next = {
				page: page + 1,
				limit,
			};
		}

		res
			.status(200)
			.json({
				success: true,
				count: bootcamp.length,
				pagintaion,
				data: bootcamp,
			});
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

	const getBootcampInRadius = asyncHandler(async (req, res) => {
		const { zipcode, distance } = req.params;

		// Get lng/lat from Geocoder
		const loc = await geoCoder.geocode(zipcode);
		const lng = loc[0].longitude;
		const lat = loc[0].latitude;

		// Calc radius using redians
		// Devide distance by radius of earth
		// Earth Reduis 3,963 mi / 6,378 km
		const radius = distance / 3963;

		const bootcamps = await Bootcamp.find({
			location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
		});

		res.status(200).json({
			success: true,
			count: bootcamps.length,
			bootcamps,
		});
	});

	return {
		createBootcamp,
		getBootcamps,
		deleteBootcamp,
		getBootcamp,
		updateBootcamp,
		getBootcampInRadius,
	};
};
