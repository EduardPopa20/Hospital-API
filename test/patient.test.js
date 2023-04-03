const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const Patient = require("../src/models/patient");

jest.mock("../src/models/patient");

beforeEach(async () => {
  await mongoose.connect(process.env.ATLAS_URL);
});

afterEach(async () => {
  await mongoose.connection.close();
  app.close();
});

describe("GET /patients", () => {
  let jwt;
  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "admin@gmail.com", password: "admin123" });
    jwt = res.body.jwt;
  });

  afterEach(async () => {
    await Patient.deleteMany();
  });

  it("should return all patients", async () => {
    const patients = [{ name: "John Doe" }, { name: "Jane Doe" }];
    await Patient.insertMany(patients);
    const res = await request(app).get("/patients").set("Authorization", `Bearer ${jwt}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining(patients));
  });

  it("should return an error message on failure", async () => {
    await Patient.deleteMany();
    const res = await request(app).get("/patients").set("Authorization", `Bearer ${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message");
  });
});
