const Patient = require("../models/patient");
const Assistant = require("../models/assistant");
const User = require("../models/user");
const Doctor = require("../models/doctor");

const createPatient = async (req, res) => {
  try {
    const { firstName, lastName, email, avatar, address, phone } = req.body;
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(403).json({ message: "A patient with this email already exists" });
    }
    const patient = await Patient.create(req.body);
    res.status(201).json({ message: "Patient created successfully.", patient });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePatientById = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      res.status(404).json({ message: `Patient with ID ${req.params.id} does not exist.` });
    }
    res
      .status(200)
      .json({ message: `Patient with ID ${req.params.id} successfully deleted.`, patient });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePatientById = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedPatient) {
      return res.status(404).json({ message: `Patient with ID ${req.params.id} does not exist.` });
    }
    res
      .status(200)
      .json({ message: `Patient with ID ${req.params.id} successfully updated.`, updatedPatient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    res
      .status(200)
      .json({ message: `Patient with ID ${req.params.id} returned successfully.`, patient });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getAssignedPatients = async (req, res) => {
  try {
    if (req.params.id && req.user.role == "manager") {
      const isDoctor = await Doctor.findOne({ _id: req.params.id });
      if (isDoctor) {
        const assignedPatients = isDoctor.assignedPatients;
        return res.status(200).json({
          message: `Doctor with ID ${req.params.id} has the following patients:`,
          assignedPatients,
        });
      } else {
        const assistant = await Assistant.findOne({ _id: req.params.id });
        const assignedPatients = assistant.assignedPatients;
        return res.status(200).json({
          message: `Doctor with ID ${req.params.id} has the following patients:`,
          assignedPatients,
        });
      }
    } else if (req.user.role == "doctor") {
      const user = await User.findOne({ _id: req.user._id });
      const doctor = await Doctor.findOne({ user });
      const assignedPatients = doctor.assignedPatients;
      return res.status(200).json({
        message: `Doctor with ID ${doctor._id} has the following patients:`,
        assignedPatients,
      });
    } else if (req.user.role == "assistant") {
      const user = await User.findOne({ _id: req.user._id });

      const assistant = await Assistant.findOne({ user });
      const assignedPatients = assistant.assignedPatients;
      return res.status(200).json({
        message: `Assistant with ID ${assistant._id} has the following patients:`,
        assignedPatients,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const associatePatientToAssistant = async (req, res) => {
  try {
    const { patientEmail, assistantEmail } = req.body;
    const patient = await Patient.findOne({ email: patientEmail });
    const userAssistant = await User.findOne({ email: assistantEmail });
    const assistant = await Assistant.findOne({ user: userAssistant._id });
    if (!patient) {
      return res.status(404).json({ message: "No such patient email." });
    }
    if (!assistant) {
      return res.status(404).json({ message: "No such assistant email." });
    }
    assistant.assignedPatients.push(patient._id);
    await assistant.save();
    patient.assignedAssistants.push(assistant._id);
    await patient.save();

    return res.status(200).json({
      message: `Patient ${patient._id} has been associated to Assistant ${assistant._id}`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const disassociatePatientFromAssistant = async (req, res) => {
  try {
    const { patientEmail, assistantEmail } = req.body;
    const patient = await Patient.findOne({ email: patientEmail });
    const userAssistant = await User.findOne({ email: assistantEmail });
    const assistant = await Assistant.findOne({ user: userAssistant._id });
    if (!patient) {
      return res.status(404).json({ message: "No such patient email." });
    }
    if (!assistant) {
      return res.status(404).json({ message: "No such assistant email." });
    }
    assistant.assignedPatients.pop(patient._id);
    await assistant.save();
    patient.assignedAssistants.pop(assistant._id);
    await patient.save();

    return res.status(200).json({
      message: `Patient ${patient._id} has been disassociated from Assistant ${assistant._id}`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const associatePatientToDoctor = async (req, res) => {
  try {
    const { patientEmail, doctorEmail } = req.body;
    const patient = await Patient.findOne({ email: patientEmail });
    const userDoctor = await User.findOne({ email: doctorEmail });
    const doctor = await Doctor.findOne({ user: userDoctor._id });
    if (!patient) {
      return res.status(404).json({ message: "No such patient email." });
    }
    if (!doctor) {
      return res.status(404).json({ message: "No such doctor email." });
    }
    doctor.assignedPatients.push(patient._id);
    await doctor.save();
    patient.assignedDoctor = doctor._id;
    await patient.save();

    return res.status(200).json({
      message: `Patient ${patient._id} has been associated to Doctor ${doctor._id}`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const disassociatePatientFromDoctor = async (req, res) => {
  try {
    const { patientEmail, doctorEmail } = req.body;
    const patient = await Patient.findOne({ email: patientEmail });
    const userDoctor = await User.findOne({ email: doctorEmail });
    const doctor = await Doctor.findOne({ user: userDoctor._id });
    if (!patient) {
      return res.status(404).json({ message: "No such patient email." });
    }
    if (!doctor) {
      return res.status(404).json({ message: "No such doctor email." });
    }
    doctor.assignedPatients.pop(patient._id);
    await doctor.save();
    patient.assignedDoctor = null;
    await patient.save();

    return res.status(200).json({
      message: `Patient ${patient._id} has been disassociated from Doctor ${doctor._id}`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
  associatePatientToAssistant,
  disassociatePatientFromAssistant,
  associatePatientToDoctor,
  disassociatePatientFromDoctor,
  getAssignedPatients,
};
