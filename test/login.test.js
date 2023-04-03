const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const User = require("../src/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

beforeEach(async () => {
  await mongoose.connect(process.env.ATLAS_URL);
});

afterEach(async () => {
  await mongoose.connection.close();
  app.close();
});

describe("POST /api/v1/login", () => {
  beforeEach(async () => {
    const password = await bcrypt.hash("testpassword", 10);
    await User.create({
      firstName: "John",
      lastName: "Doctor",
      email: "testuser@example.com",
      password: password,
      age: 35,
      address: "123 Main St",
      phone: "555-123-4567",
      role: "doctor",
    });
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it("should return a token for valid login credentials", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({
        email: "testuser@example.com",
        password: "testpassword",
      })
      .expect(200);

    const decodedToken = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decodedToken.userId).toBeDefined();
    expect(decodedToken.role).toEqual("doctor");
  });

  it("should return an error for invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({
        email: "invaliduser@example.com",
        password: "invalidpassword",
      })
      .expect(404);

    expect(res.body.message).toEqual("The email is invalid.");
  });
  it("should return an error for invalid password", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({
        email: "testuser@example.com",
        password: "invalidpassword",
      })
      .expect(404);

    expect(res.body.message).toEqual("The password is invalid.");
  });
});
