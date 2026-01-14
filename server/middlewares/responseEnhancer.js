/**
 * @desc    Inject HATEOAS links into successful JSON responses 
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Function} next
 */
const responseEnhancer = (req, res, next) => {
	const oldJson = res.json.bind(res);

	const trimTrailingSlash = (val) => val.replace(/\/$/, "");
	const collectionHref = () => {
		const raw = req.originalUrl || (req.baseUrl || "") + (req.path || "") || "/";
		const base = raw.split("?")[0] || "/";
		return trimTrailingSlash(base) || "/";
	};
	const resourceHref = () => trimTrailingSlash((req.baseUrl || "") + (req.path || "")) || "/";

	const buildRelated = (item) => {
		const links = {};
		const id = item?._id || item?.id;
		if (!id) return links;

		if (item.bootcamp) {
			const bootcampId = item.bootcamp._id || item.bootcamp.id || item.bootcamp;
			links.bootcamp = { href: `/api/v1/bootcamps/${bootcampId}` };
		}

		if (item.courses || item.averageCost !== undefined || item.location) {
			links.courses = { href: `/api/v1/bootcamps/${id}/courses` };
			links.reviews = { href: `/api/v1/bootcamps/${id}/reviews` };
		}

		if (item.rating !== undefined && item.bootcamp) {
			const bootcampId = item.bootcamp._id || item.bootcamp.id || item.bootcamp;
			links.reviews = { href: `/api/v1/bootcamps/${bootcampId}/reviews` };
		}

		return links;
	};

	const linkifyItem = (item, base) => {
		if (!item || typeof item !== "object") return item;
		const id = item._id || item.id;
		if (!id) return item;
		if (!item._links) item._links = {};
		const selfBase = base || resourceHref();
		item._links.self = { href: `${selfBase}/${id}` };
		const related = buildRelated(item);
		if (Object.keys(related).length) item._links.related = related;
		return item;
	};

	const linkifyCollection = (body, pagination) => {
		if (!body || typeof body !== "object") return body;
		const base = collectionHref();
		if (!body._links) body._links = {};
		body._links.self = { href: req.originalUrl || base };
		if (pagination?.prev) {
			body._links.prev = {
				href: `${base}?page=${pagination.prev.page}&limit=${pagination.prev.limit}`,
			};
		}
		if (pagination?.next) {
			body._links.next = {
				href: `${base}?page=${pagination.next.page}&limit=${pagination.next.limit}`,
			};
		}
		return base;
	};

	res.json = function (body) {
		try {
			if (!body || typeof body !== "object" || body.success !== true) {
				return oldJson(body);
			}

			// Handle advancedResults shape first
			if (body.data && Array.isArray(body.data)) {
				const base = linkifyCollection(body, body.pagintaion || body.pagination);
				body.data = body.data.map((item) => linkifyItem(item, base));
				return oldJson(body);
			}

			// Generic resource detection
			const resourceKey = Object.keys(body).find(
				(key) => key !== "success" && key !== "count" && key !== "pagination" && key !== "pagintaion"
			);

			if (!resourceKey) {
				return oldJson(body);
			}

			const resource = body[resourceKey];

			if (Array.isArray(resource)) {
				const base = linkifyCollection(body, body.pagintaion || body.pagination);
				body[resourceKey] = resource.map((item) => linkifyItem(item, base));
			} else if (resource && typeof resource === "object") {
				body[resourceKey] = linkifyItem(resource, resourceHref());
			}
		} catch (err) {
			// Ignore link building errors and return original body
		}

		return oldJson(body);
	};

	next();
};

export default responseEnhancer;
