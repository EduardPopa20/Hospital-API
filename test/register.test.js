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

require("dotenv").config();

jest.mock("../src/models/user");

describe("POST /api/v1/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
      age: 30,
      address: "123 Main St",
      phone: "555-555-5555",
      role: "assistant",
    };

    User.findOne.mockResolvedValue(null);
    User.prototype.save.mockResolvedValue();

    const res = await request(app).post("/api/v1/register").send(user);

    expect(res.statusCode).toBe(201);
    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(User.prototype.save).toHaveBeenCalled();
    expect(res.body).toMatchObject({ message: "User created successfully" });
  });

  it("should return an error if user already exists", async () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
      age: 30,
      address: "123 Main St",
      phone: "555-555-5555",
      role: "assistant",
    };

    User.findOne.mockResolvedValue(user);

    const res = await request(app).post("/api/v1/register").send(user);

    expect(res.statusCode).toBe(400);
    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(res.body).toMatchObject({ message: "User already exists" });
  });

  it("should return an error if there is a server error", async () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
      age: 30,
      address: "123 Main St",
      phone: "555-555-5555",
      role: "assistant",
    };

    User.findOne.mockRejectedValue(new Error("Database error"));

    const res = await request(app).post("/api/v1/register").send(user);

    expect(res.statusCode).toBe(500);
    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(res.body).toMatchObject({ message: "Server error" });
  });
});
