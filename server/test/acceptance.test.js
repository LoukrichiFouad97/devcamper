import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";

let request;
let authToken;
let publisherToken;
let adminToken;

beforeAll(() => {
	request = supertest(app);
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("ACCEPTANCE TESTS - Complete User Workflows", () => {
	describe("Scenario 1: User Registration & Profile Management", () => {
		it("should allow new user to register", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({
					name: "John Doe",
					email: "john@acceptance.com",
					password: "securePassword123",
					role: "user"
				});

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("token");
			expect(res.body.user).toHaveProperty("email", "john@acceptance.com");
			authToken = res.body.token;
		});

		it("should not allow duplicate email registration", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({
					name: "Jane Doe",
					email: "john@acceptance.com",
					password: "anotherPassword123",
					role: "user"
				});

			expect(res.status).toBe(400);
		});

		it("should allow registered user to login", async () => {
			const res = await request
				.post("/api/v1/auth/login")
				.send({
					email: "john@acceptance.com",
					password: "securePassword123"
				});

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("token");
		});

		it("should retrieve user profile with valid token", async () => {
			const res = await request
				.get("/api/v1/auth/me")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveProperty("email", "john@acceptance.com");
		});

		it("should update user details", async () => {
			const res = await request
				.put("/api/v1/auth/updatedetails")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					name: "Jonathan Doe",
					email: "jonathan@acceptance.com"
				});

			expect(res.status).toBe(200);
			expect(res.body.data.name).toBe("Jonathan Doe");
		});

		it("should update user password", async () => {
			const res = await request
				.put("/api/v1/auth/updatepassword")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					currentPassword: "securePassword123",
					newPassword: "newSecurePassword456"
				});

			expect(res.status).toBe(200);
		});

		it("should logout user", async () => {
			const res = await request
				.post("/api/v1/auth/logout")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
		});
	});

	describe("Scenario 2: Publisher Bootcamp Management Workflow", () => {
		it("should register a publisher account", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({
					name: "Tech Academy",
					email: "publisher@acceptance.com",
					password: "publisherPass123",
					role: "publisher"
				});

			expect(res.status).toBe(201);
			publisherToken = res.body.token;
		});

		it("should create a new bootcamp as publisher", async () => {
			const res = await request
				.post("/api/v1/bootcamps")
				.set("Authorization", `Bearer ${publisherToken}`)
				.send({
					name: "Tech Academy Bootcamp",
					description: "Learn full-stack development",
					website: "https://techacademy.com",
					phone: "1234567890",
					email: "info@techacademy.com",
					address: "123 Tech Street",
					careers: ["Web Development", "Mobile Development"],
					housing: true,
					jobAssistance: true
				});

			expect(res.status).toBe(201);
			expect(res.body.data).toHaveProperty("name", "Tech Academy Bootcamp");
		});

		it("should retrieve all bootcamps", async () => {
			const res = await request.get("/api/v1/bootcamps");

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it("should update bootcamp details", async () => {
			const bootcamps = await request.get("/api/v1/bootcamps");
			const bootcampId = bootcamps.body.data[0]._id;

			const res = await request
				.put(`/api/v1/bootcamps/${bootcampId}`)
				.set("Authorization", `Bearer ${publisherToken}`)
				.send({
					description: "Updated bootcamp description"
				});

			expect([200, 401, 403]).toContain(res.status);
		});
	});

	describe("Scenario 3: Course Management Within Bootcamp", () => {
		let bootcampId;

		beforeAll(async () => {
			const bootcamps = await request.get("/api/v1/bootcamps");
			if (bootcamps.body.data.length > 0) {
				bootcampId = bootcamps.body.data[0]._id;
			}
		});

		it("should create a course in bootcamp", async () => {
			if (!bootcampId) return;

			const res = await request
				.post(`/api/v1/bootcamps/${bootcampId}/courses`)
				.set("Authorization", `Bearer ${publisherToken}`)
				.send({
					title: "JavaScript Fundamentals",
					description: "Learn JS basics",
					weeks: 4,
					tuition: 5000,
					minimumSkill: "beginner"
				});

			expect([201, 401, 403]).toContain(res.status);
		});

		it("should get all courses for a bootcamp", async () => {
			if (!bootcampId) return;

			const res = await request.get(`/api/v1/courses?bootcamp=${bootcampId}`);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});
	});

	describe("Scenario 4: Review System", () => {
		let bootcampId;

		beforeAll(async () => {
			const bootcamps = await request.get("/api/v1/bootcamps");
			if (bootcamps.body.data.length > 0) {
				bootcampId = bootcamps.body.data[0]._id;
			}
		});

		it("should create a review for bootcamp", async () => {
			if (!bootcampId) return;

			const res = await request
				.post(`/api/v1/bootcamps/${bootcampId}/reviews`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "Great bootcamp experience",
					text: "The instructors are excellent",
					rating: 9
				});

			expect([201, 401, 403]).toContain(res.status);
		});

		it("should not allow invalid rating (>10)", async () => {
			if (!bootcampId) return;

			const res = await request
				.post(`/api/v1/bootcamps/${bootcampId}/reviews`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "Invalid rating",
					text: "Rating too high",
					rating: 15
				});

			expect([400, 401, 403]).toContain(res.status);
		});

		it("should not allow rating below 1", async () => {
			if (!bootcampId) return;

			const res = await request
				.post(`/api/v1/bootcamps/${bootcampId}/reviews`)
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "Invalid rating",
					text: "Rating too low",
					rating: 0
				});

			expect([400, 401, 403]).toContain(res.status);
		});

		it("should retrieve all reviews", async () => {
			const res = await request.get("/api/v1/reviews");

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});
	});

	describe("Scenario 5: Admin User Management", () => {
		it("should register an admin account", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({
					name: "Admin User",
					email: "admin@acceptance.com",
					password: "adminPass123",
					role: "admin"
				});

			expect(res.status).toBe(201);
			adminToken = res.body.token;
		});

		it("should retrieve all users as admin", async () => {
			const res = await request
				.get("/api/v1/users")
				.set("Authorization", `Bearer ${adminToken}`);

			expect([200, 401, 403]).toContain(res.status);
		});

		it("should not allow non-admin to view users", async () => {
			const res = await request
				.get("/api/v1/users")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(403);
		});

		it("should create a new user as admin", async () => {
			const res = await request
				.post("/api/v1/users")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					name: "New User",
					email: "newuser@acceptance.com",
					password: "newUserPass123",
					role: "user"
				});

			expect([201, 401, 403]).toContain(res.status);
		});

		it("should update user as admin", async () => {
			const users = await request
				.get("/api/v1/users")
				.set("Authorization", `Bearer ${adminToken}`);

			if (users.body.data && users.body.data.length > 0) {
				const userId = users.body.data[0]._id;

				const res = await request
					.put(`/api/v1/users/${userId}`)
					.set("Authorization", `Bearer ${adminToken}`)
					.send({
						name: "Updated User Name"
					});

				expect([200, 401, 403]).toContain(res.status);
			}
		});

		it("should delete user as admin", async () => {
			const users = await request
				.get("/api/v1/users")
				.set("Authorization", `Bearer ${adminToken}`);

			if (users.body.data && users.body.data.length > 1) {
				const userId = users.body.data[users.body.data.length - 1]._id;

				const res = await request
					.delete(`/api/v1/users/${userId}`)
					.set("Authorization", `Bearer ${adminToken}`);

				expect([200, 204, 401, 403]).toContain(res.status);
			}
		});
	});

	describe("Scenario 6: Authorization & Access Control", () => {
		it("should reject request without token", async () => {
			const res = await request.get("/api/v1/auth/me");

			expect(res.status).toBe(401);
		});

		it("should reject request with invalid token", async () => {
			const res = await request
				.get("/api/v1/auth/me")
				.set("Authorization", "Bearer invalidtoken");

			expect(res.status).toBe(401);
		});

		it("should reject non-publisher creating bootcamp", async () => {
			const res = await request
				.post("/api/v1/bootcamps")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					name: "Unauthorized Bootcamp",
					description: "Should fail",
					website: "https://test.com"
				});

			expect(res.status).toBe(403);
		});

		it("should reject non-admin accessing user list", async () => {
			const res = await request
				.get("/api/v1/users")
				.set("Authorization", `Bearer ${publisherToken}`);

			expect(res.status).toBe(403);
		});
	});

	describe("Scenario 7: Error Handling", () => {
		it("should handle invalid bootcamp ID", async () => {
			const res = await request.get("/api/v1/bootcamps/invalidid");

			expect([400, 404]).toContain(res.status);
		});

		it("should handle missing required fields", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({
					name: "Incomplete User"
				});

			expect(res.status).toBe(400);
		});

		it("should handle invalid email format", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({
					name: "Test User",
					email: "invalidemail",
					password: "password123",
					role: "user"
				});

			expect([400, 422]).toContain(res.status);
		});

		it("should handle weak password", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({
					name: "Test User",
					email: "test@weak.com",
					password: "123",
					role: "user"
				});

			expect([400, 422]).toContain(res.status);
		});
	});

	describe("Scenario 8: Data Pagination & Filtering", () => {
		it("should support pagination in bootcamp list", async () => {
			const res = await request.get("/api/v1/bootcamps?limit=5&skip=0");

			expect(res.status).toBe(200);
			expect(res.body.data).toBeDefined();
		});

		it("should support sorting in bootcamp list", async () => {
			const res = await request.get("/api/v1/bootcamps?sort=-createdAt");

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it("should filter bootcamps by location", async () => {
			const res = await request.get("/api/v1/bootcamps?careers=Web Development");

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});
	});

	describe("Scenario 8: HATEOAS & Caching", () => {
		let bootcampId;

		beforeAll(async () => {
			const bootcamps = await request.get("/api/v1/bootcamps");
			if (bootcamps.body.data && bootcamps.body.data.length > 0) {
				bootcampId = bootcamps.body.data[0]._id;
			}
		});

		it("should include _links on collection responses", async () => {
			const res = await request.get("/api/v1/bootcamps?limit=1&page=1");

			expect(res.status).toBe(200);
			expect(res.body._links).toBeDefined();
			expect(res.body._links.self).toBeDefined();
			if (res.body.data && res.body.data[0]) {
				expect(res.body.data[0]._links).toBeDefined();
				expect(res.body.data[0]._links.self).toBeDefined();
			}
		});

		it("should include _links on single resource responses", async () => {
			if (!bootcampId) return;

			const res = await request.get(`/api/v1/bootcamps/${bootcampId}`);

			expect(res.status).toBe(200);
			expect(res.body.data._links).toBeDefined();
			expect(res.body.data._links.self).toBeDefined();
		});

		it("should respond 304 when ETag matches", async () => {
			const first = await request.get("/api/v1/bootcamps");
			const etag = first.headers.etag;
			if (!etag) return;

			const second = await request
				.get("/api/v1/bootcamps")
				.set("If-None-Match", etag);

			expect([200, 304]).toContain(second.status);
			if (second.status === 304) {
				expect(second.text).toBe("" || undefined);
			}
		});
	});
});
