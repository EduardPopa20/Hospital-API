const express = require("express");
const app = express();
const http = require("http");
const db = require("./src/config/db.config");
const authRoutes = require("./src/routes/auth");
const patientRoutes = require("./src/routes/patient");
const assistantRoutes = require("./src/routes/assistant");
const doctorRoutes = require("./src/routes/doctor");
const treatmentRoutes = require("./src/routes/treatment");

const PORT = 3000;

app.use(express.json());
app.use("/api/v1", authRoutes);
app.use("/api/v1", patientRoutes);
app.use("/api/v1", assistantRoutes);
app.use("/api/v1", doctorRoutes);
app.use("/api/v1", treatmentRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
module.exports = server;
