import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";

let request;

beforeAll(() => {
	request = supertest(app);
});

describe("Bootcamp API - /api/v1/bootcamps", () => {
	let bootcampId;
	let publisherToken;
	let adminToken;

	beforeAll(async () => {
		// Create publisher user
		const publisher = {
			name: "Publisher User",
			email: "publisher@example.com",
			password: "password123",
			role: "publisher",
		};
		const pubRes = await request.post("/api/v1/auth/register").send(publisher);
		publisherToken = pubRes.body.token;

		// Create admin user
		const admin = {
			name: "Admin User",
			email: "admin@example.com",
			password: "password123",
			role: "admin",
		};
		const adminRes = await request.post("/api/v1/auth/register").send(admin);
		adminToken = adminRes.body.token;
	});

	describe("GET /", () => {
		it("should get all bootcamps (requires auth)", async () => {
			const res = await request
				.get("/api/v1/bootcamps")
				.set("Authorization", `Bearer ${publisherToken}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it("should fail to get bootcamps without auth", async () => {
			const res = await request.get("/api/v1/bootcamps");

			expect(res.status).toBe(401);
		});
	});

	describe("POST /", () => {
		it("should create a bootcamp with valid data", async () => {
			const bootcampData = {
				name: "Test Bootcamp",
				description: "A great bootcamp",
				website: "https://testbootcamp.com",
				phone: "1234567890",
				email: "test@bootcamp.com",
				address: "123 Main St",
				city: "Test City",
				state: "TS",
				zipcode: "12345",
				country: "USA",
				careers: ["Web Development", "Mobile Development"],
			};

			const res = await request
				.post("/api/v1/bootcamps")
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(bootcampData);

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body.data).toHaveProperty("_id");
			bootcampId = res.body.data._id;
		});

		it("should fail to create bootcamp with missing required fields", async () => {
			const bootcampData = {
				name: "Test Bootcamp",
				description: "A great bootcamp",
			};

			const res = await request
				.post("/api/v1/bootcamps")
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(bootcampData);

			expect(res.status).toBe(400);
		});

		it("should fail to create bootcamp without auth", async () => {
			const bootcampData = {
				name: "Test Bootcamp",
				description: "A great bootcamp",
			};

			const res = await request
				.post("/api/v1/bootcamps")
				.send(bootcampData);

			expect(res.status).toBe(401);
		});
	});

	describe("GET /:bootcampid", () => {
		it("should get a bootcamp by ID", async () => {
			const res = await request.get(`/api/v1/bootcamps/${bootcampId}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body.data._id).toBe(bootcampId);
		});

		it("should fail to get bootcamp with invalid ID", async () => {
			const res = await request.get("/api/v1/bootcamps/invalid-id");

			expect(res.status).toBe(400);
		});

		it("should fail to get non-existent bootcamp", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request.get(`/api/v1/bootcamps/${fakeId}`);

			expect(res.status).toBe(404);
		});
	});

	describe("PUT /:bootcampid", () => {
		it("should update bootcamp with valid data", async () => {
			const updates = {
				name: "Updated Bootcamp Name",
				description: "Updated description",
			};

			const res = await request
				.put(`/api/v1/bootcamps/${bootcampId}`)
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(updates);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body.data.name).toBe("Updated Bootcamp Name");
		});

		it("should fail to update bootcamp without auth", async () => {
			const res = await request.put(`/api/v1/bootcamps/${bootcampId}`).send({
				name: "Updated Name",
			});

			expect(res.status).toBe(401);
		});

		it("should fail to update non-existent bootcamp", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request
				.put(`/api/v1/bootcamps/${fakeId}`)
				.set("Authorization", `Bearer ${publisherToken}`)
				.send({ name: "Updated Name" });

			expect(res.status).toBe(404);
		});
	});

	describe("DELETE /:bootcampid", () => {
		it("should delete bootcamp with valid auth", async () => {
			const res = await request
				.delete(`/api/v1/bootcamps/${bootcampId}`)
				.set("Authorization", `Bearer ${publisherToken}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
		});

		it("should fail to delete bootcamp without auth", async () => {
			const bootcampData = {
				name: "Test Bootcamp 2",
				description: "A great bootcamp",
				website: "https://testbootcamp2.com",
				phone: "1234567890",
				email: "test2@bootcamp.com",
				address: "456 Main St",
				city: "Test City",
				state: "TS",
				zipcode: "12346",
				country: "USA",
				careers: ["Web Development"],
			};

			const createRes = await request
				.post("/api/v1/bootcamps")
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(bootcampData);

			const deleteRes = await request.delete(
				`/api/v1/bootcamps/${createRes.body.data._id}`
			);

			expect(deleteRes.status).toBe(401);
		});

		it("should fail to delete non-existent bootcamp", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request
				.delete(`/api/v1/bootcamps/${fakeId}`)
				.set("Authorization", `Bearer ${publisherToken}`);

			expect(res.status).toBe(404);
		});
	});
});
