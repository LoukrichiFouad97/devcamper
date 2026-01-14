import _ from "lodash";
import path from "path";

import { ErrorResponse } from "../utils/errorResponse.js";
import { Bootcamp } from "../models/Bootcamp.model.js";
import { asyncHandler } from "../middlewares/async.js";
import { geoCoder } from "../utils/geoCoder.js";
import { config } from "../config/config.js";

/**
 * @desc    Get all bootcamps (supports filters via advancedResults)
 * @route   GET /api/v1/bootcamps
 * @access  Private (publisher/admin)
 */
export const getBootcamps = asyncHandler(async (req, res) => {
	res.status(200).json(res.advancedResults);
});

/**
 * @desc    Create new bootcamp for current user
 * @route   POST /api/v1/bootcamps
 * @access  Private
 */
export const createBootcamp = asyncHandler(async (req, res, next) => {
	req.body.user = req.user.id;
	const publishedBootcamps = await Bootcamp.findOne({ user: req.user.id });

	// Check if bootcamp exists and if the user has the authorization to create one
	if (publishedBootcamps && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`The user with ID ${req.user.id} has already published a bootcamp`,
				400
			)
		);
	}

	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @desc    Get single bootcamp by id
 * @route   GET /api/v1/bootcamps/:bootcampid
 * @access  Public
 */
export const getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.bootcampid);
	if (!bootcamp)
		return next(
			new ErrorResponse(
				`Bootcamp not found with id ${req.params.bootcampid}`,
				404
			)
		);
	res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc    Update bootcamp (owner or admin)
 * @route   PUT /api/v1/bootcamps/:bootcampid
 * @access  Private (publisher/admin)
 */
export const updateBootcamp = asyncHandler(async (req, res, next) => {
	let bootcamp = await Bootcamp.findById(req.params.bootcampid);
	if (!bootcamp) return next(new ErrorResponse("bootcamp not found", 404));

	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not authorized to update this bootcamp`,
				404
			)
		);
	}

	bootcamp = await Bootcamp.findByIdAndUpdate(req.params.bootcampid, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({ success: true, updated: bootcamp });
});

/**
 * @desc    Delete bootcamp
 * @route   DELETE /api/v1/bootcamps/:bootcampid
 * @access  Private (publisher/admin)
 */
export const deleteBootcamp = asyncHandler(async (req, res) => {
	const bootcamp = await Bootcamp.findById(req.params.bootcampid);
	if (!bootcamp) return res.status(400).json({ error: "not found" });

	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not authorized to update this bootcamp`,
				404
			)
		);
	}

	bootcamp.remove();
	res.status(200).json({ success: true, removed: bootcamp });
});

/**
 * @desc    Get bootcamps within distance of a zipcode
 * @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access  Private
 */
export const getBootcampInRadius = asyncHandler(async (req, res) => {
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

/**
 * @desc    Upload bootcamp photo
 * @route   PUT /api/v1/bootcamps/:bootcampid/photo
 * @access  Private (publisher/admin)
 */
export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcampId = req.params.bootcampid;
	const bootcamp = await Bootcamp.findById(bootcampId);
	if (!bootcamp)
		return next(
			new ErrorResponse(`Bootcamp not found with id${bootcampId}`, 404)
		);

	if (bootcamp.user.toString() !== req.user.id || req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not authorized to update this bootcamp`,
				404
			)
		);
	}
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
