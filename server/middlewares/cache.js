import crypto from "crypto";

/**
 * Cache middleware 	 computes ETag for responses and supports conditional GET (304 Not Modified)
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const cacheMiddleware = (req, res, next) => {
	const oldSend = res.send.bind(res);

	res.send = function (body) {
		try {
			// Do not cache auth or user-specific endpoints
			const isAuthPath = req.path.startsWith("/api/v1/auth");
			const hasAuthHeader = !!req.headers["authorization"]; // bearer tokens
			if (req.method === "GET" && body && !isAuthPath && !hasAuthHeader) {
				const str = typeof body === "string" ? body : JSON.stringify(body);
				const hash = crypto.createHash("md5").update(str).digest("hex");
				res.set("ETag", `W/"${hash}"`);
				res.set("Cache-Control", "public, max-age=60");
				res.set("Vary", "Authorization, Cookie");

				
				const ifNoneMatch = req.headers["if-none-match"];
				if (ifNoneMatch && ifNoneMatch === `W/"${hash}"`) {
					res.status(304).end();
					return;
				}
			} else {
				// Explicitly prevent caching for auth endpoints
				res.set("Cache-Control", "no-store");
			}
		} catch (err) {
			// Ignore hashing errors and send response normally
		}

		return oldSend(body);
	};

	next();
};

export default cacheMiddleware;
