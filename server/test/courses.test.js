import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";

let request;

beforeAll(() => {
	request = supertest(app);
});

describe("Course API - /api/v1/courses", () => {
	let bootcampId;
	let courseId;
	let publisherToken;

	beforeAll(async () => {
		const publisher = {
			name: "Course Publisher",
			email: "coursepub@example.com",
			password: "password123",
			role: "publisher",
		};
		const res = await request.post("/api/v1/auth/register").send(publisher);
		publisherToken = res.body.token;

		// Create a bootcamp for courses
		const bootcampData = {
			name: "Course Test Bootcamp",
			description: "Test bootcamp for courses",
			website: "https://coursetest.com",
			phone: "9876543210",
			email: "coursetest@bootcamp.com",
			address: "789 Course St",
			city: "Course City",
			state: "CS",
			zipcode: "54321",
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
		it("should get all courses", async () => {
			const res = await request.get("/api/v1/courses");

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it("should get bootcamp courses", async () => {
			const res = await request.get(
				`/api/v1/bootcamps/${bootcampId}/courses`
			);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(Array.isArray(res.body.data)).toBe(true);
		});
	});

	describe("POST /", () => {
		it("should create a course with valid data", async () => {
			const courseData = {
				title: "Test Course",
				description: "A great course",
				weeks: 12,
				tuition: 5000,
				minimumSkill: "beginner",
				bootcamp: bootcampId,
			};

			const res = await request
				.post("/api/v1/courses")
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(courseData);

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body.data).toHaveProperty("_id");
			courseId = res.body.data._id;
		});

		it("should fail to create course with missing fields", async () => {
			const courseData = {
				title: "Test Course",
				description: "A great course",
			};

			const res = await request
				.post("/api/v1/courses")
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(courseData);

			expect(res.status).toBe(400);
		});

		it("should fail to create course without auth", async () => {
			const courseData = {
				title: "Test Course",
				description: "A great course",
				weeks: 12,
				tuition: 5000,
				minimumSkill: "beginner",
				bootcamp: bootcampId,
			};

			const res = await request.post("/api/v1/courses").send(courseData);

			expect(res.status).toBe(401);
		});
	});

	describe("GET /:courseid", () => {
		it("should get a course by ID", async () => {
			const res = await request.get(`/api/v1/courses/${courseId}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
			expect(res.body.data._id).toBe(courseId);
		});

		it("should fail to get course with invalid ID", async () => {
			const res = await request.get("/api/v1/courses/invalid-id");

			expect(res.status).toBe(400);
		});

		it("should fail to get non-existent course", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request.get(`/api/v1/courses/${fakeId}`);

			expect(res.status).toBe(404);
		});
	});

	describe("PUT /:courseid", () => {
		it("should update course with valid data", async () => {
			const updates = {
				title: "Updated Course Title",
				tuition: 6000,
			};

			const res = await request
				.put(`/api/v1/courses/${courseId}`)
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(updates);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
		});

		it("should fail to update course without auth", async () => {
			const res = await request.put(`/api/v1/courses/${courseId}`).send({
				title: "Updated Title",
			});

			expect(res.status).toBe(401);
		});

		it("should fail to update non-existent course", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request
				.put(`/api/v1/courses/${fakeId}`)
				.set("Authorization", `Bearer ${publisherToken}`)
				.send({ title: "Updated Title" });

			expect(res.status).toBe(404);
		});
	});

	describe("DELETE /:courseid", () => {
		it("should delete course with valid auth", async () => {
			const res = await request
				.delete(`/api/v1/courses/${courseId}`)
				.set("Authorization", `Bearer ${publisherToken}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("success", true);
		});

		it("should fail to delete course without auth", async () => {
			const courseData = {
				title: "Test Course 2",
				description: "Another course",
				weeks: 8,
				tuition: 3000,
				minimumSkill: "intermediate",
				bootcamp: bootcampId,
			};

			const createRes = await request
				.post("/api/v1/courses")
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(courseData);

			const deleteRes = await request.delete(
				`/api/v1/courses/${createRes.body.data._id}`
			);

			expect(deleteRes.status).toBe(401);
		});

		it("should fail to delete non-existent course", async () => {
			const fakeId = new mongoose.Types.ObjectId();
			const res = await request
				.delete(`/api/v1/courses/${fakeId}`)
				.set("Authorization", `Bearer ${publisherToken}`);

			expect(res.status).toBe(404);
		});
	});
});
