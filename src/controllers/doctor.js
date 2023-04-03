const Doctor = require("../models/doctor");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Patient = require("../models/patient");

const createDoctor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, address, phone, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Doctor already exists." });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      address,
      phone,
      role,
    });
    await newUser.save();
    const doctor = await Doctor.create({ user: newUser._id });
    res.status(201).json({ message: "Doctor created successfully.", doctor });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

const deleteDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id).populate("user", "-password");
    if (!doctor) {
      return res.status(404).json({ message: `Doctor with ID ${req.params.id} does not exist.` });
    }
    await User.findByIdAndDelete(doctor.user);
    return res
      .status(2001)
      .json({ message: `Doctor with ID ${req.params.id} successfully deleted.`, doctor });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateDoctorById = async (req, res) => {
  try {
    const currentDoctor = await Doctor.findById(req.params.id).populate("user");

    const updatedUser = await User.findByIdAndUpdate(currentDoctor.user, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: `Doctor with ID ${req.params.id} does not exist.` });
    }
    res.status(200).json({ message: `Doctor with ID ${req.params.id} successfully updated.` });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user", "-password");
    if (!doctor) {
      return res.status(404).json({ message: `Doctor with ID ${req.params.id} does not exist.` });
    }
    res
      .status(200)
      .json({ message: `Doctor with ID ${req.params.id} returned successfully.`, doctor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user", "-password");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getDoctorsReport = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user", "-password").populate("assignedPatients");
    const patientsOver50 = await Patient.countDocuments({ age: { $gte: 50 } });
    console.log(patientsOver50);

    const nrPatientsWithDiabetes = await Patient.countDocuments({
      medicalProblems: { $in: ["diabetes"] },
    });
    const nrPatientsWithGastritis = await Patient.countDocuments({
      medicalProblems: { $in: ["gastritis"] },
    });
    const report = {
      doctors,
      "Patients over 30 years old": patientsOver50,
      "Patients with diabetes": nrPatientsWithDiabetes,
      "Patients with gastritis": nrPatientsWithGastritis,
    };
    res.status(200).json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
  getDoctorsReport,
};
