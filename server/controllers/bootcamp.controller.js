import _ from "lodash";
import path from "path";

import { ErrorResponse } from "../utils/errorResponse";
import { Bootcamp } from "../models/Bootcamp.model";
import { middlewares } from "../middlewares";
import { geoCoder } from "../utils/geoCoder";
import { config } from "../config/config";

export const bootcampController = () => {
	const asyncHandler = middlewares.asyncHandler;

	const getBootcamps = asyncHandler(async (req, res) => {
		res.status(200).json(res.advancedResults);
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
			req.params.bootcampid,
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
		const bootcamp = await Bootcamp.findById(req.params.bootcampid);
		if (!bootcamp) return res.status(400).json({ error: "not found" });
		bootcamp.remove();
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

	const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
		const bootcampId = req.params.bootcampid;
		const bootcamp = await Bootcamp.findById(bootcampId);
		if (!bootcamp)
			return next(
				new ErrorResponse(`Bootcamp not found with id${bootcampId}`, 404)
			);
		if (!req.files) {
			return next(new ErrorResponse(`Please add a photo`, 404));
		}

		const file = req.files.file;

		if (!file.mimetype.startsWith("image")) {
			return next(new ErrorResponse(`Please upload valid image`, 400));
		}

		if (file.size > process.env.MAX_UPLOAD_SIZE) {
			return next(
				new ErrorResponse(
					`Please upload a photo that is less than ${config.photo.max_size} `,
					400
				)
			);
		}

		// Create a custome filename
		file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
		file.mv(`${config.photo.path}/${file.name}`, (err) => {
			if (err) {
				return next(new ErrorResponse("File upload failed", 500));
			}
		});

		await Bootcamp.findByIdAndUpdate(bootcampId, { photo: file.name });

		res.status(200).json({ success: true, data: file.name });
	});
	return {
		createBootcamp,
		getBootcamps,
		deleteBootcamp,
		getBootcamp,
		updateBootcamp,
		getBootcampInRadius,
		bootcampPhotoUpload,
	};
};
