export const advancedResults = (model, populate) => async (req, res, next) => {
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

	query = model.find(JSON.parse(queryStr));

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
	const total = await model.countDocuments(); // calculates the total documents in the model

	query = query.skip(startIndex).limit(limit);

	const models = await query;

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

	if (populate) {
		query = query.populate(populate);
	}

	res.advancedResults = {
		success: true,
		count: models.length,
		pagintaion,
		data: models,
	};

	next();
};
