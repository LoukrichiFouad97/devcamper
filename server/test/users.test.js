import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";

let request;

beforeAll(() => {
	request = supertest(app);
});

describe("User API - /api/v1/users (Admin Only)", () => {
	let adminToken;
	let userId;

	beforeAll(async () => {
		// Create admin user
		const admin = {
			name: "Admin",
			email: "testadmin@example.com",
			password: "password123",
			role: "admin",
		};
		const res = await request.post("/api/v1/auth/register").send(admin);
		adminToken = res.body.token;
	});

	describe("GET /", () => {
		it("should get all users as admin", async () => {
			const res = await request
				.get("/api/v1/users")
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(Array.isArray(res.body.data)).toBe(true);
			userId = res.body.data[0]._id;
		});

		it("should fail to get users without admin role", async () => {
			const user = {
				name: "Regular User",
				email: "regularuser@example.com",
				password: "password123",
				role: "user",
			};
			const userRes = await request
				.post("/api/v1/auth/register")
				.send(user);
			const userToken = userRes.body.token;

			const res = await request
				.get("/api/v1/users")
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(403);
		});

		it("should fail to get users without auth", async () => {
			const res = await request.get("/api/v1/users");

			expect(res.status).toBe(401);
		});
	});

	describe("GET /:userId", () => {
		it("should get a user by ID as admin", async () => {
			const res = await request
				.get(`/api/v1/users/${userId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body.data._id).toBe(userId);
		});

		it("should fail to get user with invalid ID", async () => {
			const res = await request
				.get("/api/v1/users/invalid-id")
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(400);
		});

		it("should fail to get non-existent user", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request
				.get(`/api/v1/users/${fakeId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(404);
		});
	});

	describe("POST /", () => {
		it("should create a user as admin", async () => {
			const userData = {
				name: "New User",
				email: "newuser@example.com",
				password: "password123",
				role: "user",
			};

			const res = await request
				.post("/api/v1/users")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(userData);

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body.data).toHaveProperty("_id");
		});

		it("should fail to create user with missing fields", async () => {
			const userData = {
				name: "New User",
				email: "newuser2@example.com",
			};

			const res = await request
				.post("/api/v1/users")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(userData);

			expect(res.status).toBe(400);
		});

		it("should fail to create user without admin role", async () => {
			const user = {
				name: "User",
				email: "user@example.com",
				password: "password123",
				role: "user",
			};
			const userRes = await request
				.post("/api/v1/auth/register")
				.send(user);
			const userToken = userRes.body.token;

			const userData = {
				name: "New User",
				email: "newuser3@example.com",
				password: "password123",
			};

			const res = await request
				.post("/api/v1/users")
				.set("Authorization", `Bearer ${userToken}`)
				.send(userData);

			expect(res.status).toBe(403);
		});
	});

	describe("PUT /:userId", () => {
		it("should update user as admin", async () => {
			const updates = {
				name: "Updated User Name",
			};

			const res = await request
				.put(`/api/v1/users/${userId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send(updates);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
		});

		it("should fail to update user without admin role", async () => {
			const user = {
				name: "User2",
				email: "user2@example.com",
				password: "password123",
				role: "user",
			};
			const userRes = await request
				.post("/api/v1/auth/register")
				.send(user);
			const userToken = userRes.body.token;

			const res = await request
				.put(`/api/v1/users/${userId}`)
				.set("Authorization", `Bearer ${userToken}`)
				.send({ name: "Updated Name" });

			expect(res.status).toBe(403);
		});

		it("should fail to update non-existent user", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request
				.put(`/api/v1/users/${fakeId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ name: "Updated Name" });

			expect(res.status).toBe(404);
		});
	});

	describe("DELETE /:userId", () => {
		it("should delete user as admin", async () => {
			const res = await request
				.delete(`/api/v1/users/${userId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
		});

		it("should fail to delete user without admin role", async () => {
			const user = {
				name: "User3",
				email: "user3@example.com",
				password: "password123",
				role: "user",
			};
			const userRes = await request
				.post("/api/v1/auth/register")
				.send(user);
			const userToken = userRes.body.token;

			const createRes = await request
				.post("/api/v1/users")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					name: "User To Delete",
					email: "usertodelete@example.com",
					password: "password123",
				});

			const res = await request
				.delete(`/api/v1/users/${createRes.body.data._id}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(403);
		});

		it("should fail to delete non-existent user", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request
				.delete(`/api/v1/users/${fakeId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(404);
		});
	});
});
