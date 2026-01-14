import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";

let mongod;
let app;
let request;

// Set environment variables BEFORE importing app
process.env.NODE_ENV = "test";
process.env.DEVCAMPER_JWT = "test-secret-key";

beforeAll(async () => {
	mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();
	process.env.MONGO_URI = uri;

	const { default: importedApp } = await import("../app.js");
	app = importedApp;
	request = supertest(app);
});

afterAll(async () => {
	try {
		await mongoose.disconnect();
	} catch (err) {
		console.error("Error disconnecting mongoose:", err);
	}
	if (mongod) {
		await mongod.stop();
	}
});

// ==================== AUTH TESTS ====================
describe("Auth API - /api/v1/auth", () => {
	const testUser = {
		name: "Test User",
		email: "test@example.com",
		password: "password123",
	};
	let authToken;

	describe("POST /register", () => {
		it("should register a new user successfully", async () => {
			const res = await request.post("/api/v1/auth/register").send(testUser);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body).toHaveProperty("token");
			expect(res.body.token).toBeTruthy();
		});

		it("should fail to register with duplicate email", async () => {
			const res = await request.post("/api/v1/auth/register").send(testUser);

			expect(res.status).toBe(400);
			expect(res.body.success).toBe(false);
		});

		it("should fail to register without email", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({ name: "User", password: "pass123" });

			expect(res.status).toBe(400);
		});

		it("should fail to register without password", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({ name: "User", email: "user@test.com" });

			expect(res.status).toBe(400);
		});

		it("should fail to register with weak password", async () => {
			const res = await request
				.post("/api/v1/auth/register")
				.send({ name: "User", email: "user@test.com", password: "123" });

			expect(res.status).toBe(400);
		});
	});

	describe("POST /login", () => {
		it("should login with valid credentials", async () => {
			const credentials = {
				email: testUser.email,
				password: testUser.password,
			};

			const res = await request.post("/api/v1/auth/login").send(credentials);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body).toHaveProperty("token");
			authToken = res.body.token;
		});

		it("should fail login with wrong password", async () => {
			const credentials = {
				email: testUser.email,
				password: "wrongpassword",
			};

			const res = await request.post("/api/v1/auth/login").send(credentials);

			expect(res.status).toBe(401);
			expect(res.body.success).toBe(false);
		});

		it("should fail login with non-existent email", async () => {
			const credentials = {
				email: "nonexistent@test.com",
				password: "password123",
			};

			const res = await request.post("/api/v1/auth/login").send(credentials);

			expect(res.status).toBe(401);
		});

		it("should fail login without email", async () => {
			const res = await request
				.post("/api/v1/auth/login")
				.send({ password: "password123" });

			expect(res.status).toBe(400);
		});

		it("should fail login without password", async () => {
			const res = await request
				.post("/api/v1/auth/login")
				.send({ email: "test@example.com" });

			expect(res.status).toBe(400);
		});
	});

	describe("GET /me", () => {
		it("should get current user with valid token", async () => {
			const res = await request
				.get("/api/v1/auth/me")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body).toHaveProperty("user");
			expect(res.body.user.email).toBe(testUser.email);
		});

		it("should fail to get current user without token", async () => {
			const res = await request.get("/api/v1/auth/me");

			expect(res.status).toBe(401);
		});

		it("should fail to get current user with invalid token", async () => {
			const res = await request
				.get("/api/v1/auth/me")
				.set("Authorization", "Bearer invalidtoken");

			expect(res.status).toBe(401);
		});

		it("should fail to get current user with malformed auth header", async () => {
			const res = await request
				.get("/api/v1/auth/me")
				.set("Authorization", "NotBearer token");

			expect(res.status).toBe(401);
		});
	});

	describe("PUT /updatedetails", () => {
		it("should update user details with valid token", async () => {
			const updates = {
				name: "Updated User",
				email: "updated@example.com",
			};

			const res = await request
				.put("/api/v1/auth/updatedetails")
				.set("Authorization", `Bearer ${authToken}`)
				.send(updates);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
		});

		it("should fail to update details without token", async () => {
			const res = await request.put("/api/v1/auth/updatedetails").send({
				name: "Updated User",
			});

			expect(res.status).toBe(401);
		});

		it("should fail to update with duplicate email", async () => {
			const anotherUser = {
				name: "Another User",
				email: "another@example.com",
				password: "password123",
			};
			await request.post("/api/v1/auth/register").send(anotherUser);

			const credentials = {
				email: anotherUser.email,
				password: anotherUser.password,
			};
			const loginRes = await request.post("/api/v1/auth/login").send(credentials);
			const token = loginRes.body.token;

			const res = await request
				.put("/api/v1/auth/updatedetails")
				.set("Authorization", `Bearer ${token}`)
				.send({ email: "updated@example.com" });

			expect(res.status).toBe(400);
		});
	});

	describe("PUT /updatepassword", () => {
		it("should update password with valid current password", async () => {
			const credentials = {
				email: "another@example.com",
				password: "password123",
			};
			const loginRes = await request.post("/api/v1/auth/login").send(credentials);
			const token = loginRes.body.token;

			const res = await request
				.put("/api/v1/auth/updatepassword")
				.set("Authorization", `Bearer ${token}`)
				.send({
					currentPassword: "password123",
					newPassword: "newpassword123",
				});

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
		});

		it("should fail to update password with wrong current password", async () => {
			const credentials = {
				email: "updated@example.com",
				password: "newpassword123",
			};
			const loginRes = await request.post("/api/v1/auth/login").send(credentials);
			const token = loginRes.body.token;

			const res = await request
				.put("/api/v1/auth/updatepassword")
				.set("Authorization", `Bearer ${token}`)
				.send({
					currentPassword: "wrongpassword",
					newPassword: "anotherpassword123",
				});

			expect(res.status).toBe(401);
		});

		it("should fail to update password without token", async () => {
			const res = await request.put("/api/v1/auth/updatepassword").send({
				currentPassword: "password123",
				newPassword: "newpassword123",
			});

			expect(res.status).toBe(401);
		});
	});

	describe("POST /logout", () => {
		it("should logout successfully", async () => {
			const res = await request
				.post("/api/v1/auth/logout")
				.set("Authorization", `Bearer ${authToken}`);

			expect(res.status).toBe(200);
		});
	});
});
