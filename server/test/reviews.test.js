import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";

let request;

beforeAll(() => {
	request = supertest(app);
});

describe("Review API - /api/v1/reviews", () => {
	let bootcampId;
	let reviewId;
	let userToken;
	let publisherToken;

	beforeAll(async () => {
		// Create user for reviews
		const user = {
			name: "Review User",
			email: "reviewer@example.com",
			password: "password123",
			role: "user",
		};
		const userRes = await request.post("/api/v1/auth/register").send(user);
		userToken = userRes.body.token;

		// Create publisher
		const publisher = {
			name: "Review Publisher",
			email: "reviexpub@example.com",
			password: "password123",
			role: "publisher",
		};
		const pubRes = await request.post("/api/v1/auth/register").send(publisher);
		publisherToken = pubRes.body.token;

		// Create bootcamp
		const bootcampData = {
			name: "Review Test Bootcamp",
			description: "Test bootcamp for reviews",
			website: "https://reviewtest.com",
			phone: "5555555555",
			email: "reviewtest@bootcamp.com",
			address: "111 Review St",
			city: "Review City",
			state: "RC",
			zipcode: "11111",
			country: "USA",
			careers: ["Web Development"],
		};

		const bootRes = await request
			.post("/api/v1/bootcamps")
			.set("Authorization", `Bearer ${publisherToken}`)
			.send(bootcampData);

		bootcampId = bootRes.body.data._id;
	});

	describe("GET /", () => {
		it("should get all reviews", async () => {
			const res = await request.get("/api/v1/reviews");

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it("should get bootcamp reviews", async () => {
			const res = await request.get(
				`/api/v1/bootcamps/${bootcampId}/reviews`
			);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(Array.isArray(res.body.data)).toBe(true);
		});
	});

	describe("POST /", () => {
		it("should create a review with valid data", async () => {
			const reviewData = {
				title: "Great Bootcamp",
				text: "Amazing experience and learned a lot",
				rating: 9,
				bootcamp: bootcampId,
			};

			const res = await request
				.post("/api/v1/reviews")
				.set("Authorization", `Bearer ${userToken}`)
				.send(reviewData);

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body.data).toHaveProperty("_id");
			reviewId = res.body.data._id;
		});

		it("should fail to create review with missing fields", async () => {
			const reviewData = {
				title: "Great Bootcamp",
				text: "Amazing experience",
			};

			const res = await request
				.post("/api/v1/reviews")
				.set("Authorization", `Bearer ${userToken}`)
				.send(reviewData);

			expect(res.status).toBe(400);
		});

		it("should fail to create review without auth", async () => {
			const reviewData = {
				title: "Great Bootcamp",
				text: "Amazing experience",
				rating: 9,
				bootcamp: bootcampId,
			};

			const res = await request.post("/api/v1/reviews").send(reviewData);

			expect(res.status).toBe(401);
		});

		it("should fail to create review with rating > 10", async () => {
			const reviewData = {
				title: "Great Bootcamp",
				text: "Amazing experience",
				rating: 15,
				bootcamp: bootcampId,
			};

			const res = await request
				.post("/api/v1/reviews")
				.set("Authorization", `Bearer ${userToken}`)
				.send(reviewData);

			expect(res.status).toBe(400);
		});

		it("should fail to create review with rating < 1", async () => {
			const reviewData = {
				title: "Great Bootcamp",
				text: "Amazing experience",
				rating: 0,
				bootcamp: bootcampId,
			};

			const res = await request
				.post("/api/v1/reviews")
				.set("Authorization", `Bearer ${userToken}`)
				.send(reviewData);

			expect(res.status).toBe(400);
		});
	});

	describe("GET /:reviewId", () => {
		it("should get a review by ID", async () => {
			const res = await request.get(`/api/v1/reviews/${reviewId}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body.data._id).toBe(reviewId);
		});

		it("should fail to get review with invalid ID", async () => {
			const res = await request.get("/api/v1/reviews/invalid-id");

			expect(res.status).toBe(400);
		});

		it("should fail to get non-existent review", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request.get(`/api/v1/reviews/${fakeId}`);

			expect(res.status).toBe(404);
		});
	});
});
