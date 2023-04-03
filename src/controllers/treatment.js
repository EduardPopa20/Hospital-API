const Treatment = require("../models/treatment");
const Patient = require("../models/patient");
const User = require("../models/user");
const Doctor = require("../models/doctor");
const Assistant = require("../models/assistant");

const createTreatment = async (req, res) => {
  try {
    const { name, details, patientEmail, assistantEmail } = req.body;
    const patient = await Patient.findOne({ email: patientEmail });
    const existingTreatment = await Treatment.findOne({ name });
    if (existingTreatment) {
      return res
        .status(404)
        .json({ message: "Treatment already exists. Choose another treatment name." });
    }
    if (!patient) {
      return res.status(404).json({ message: "No such patient email." });
    }

    const currentDoctor = await Doctor.findOne({ user: req.user._id });
    const treatment = new Treatment({
      name,
      details,
      prescribedBy: currentDoctor._id,
      prescribedTo: patient._id,
    });

    const newTreatment = await treatment.save();
    patient.treatments.push(newTreatment._id);
    await patient.save();
    res.status(201).json({ message: "Treatment created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find();
    res.status(200).json({ message: "Successfully retrieved all treatments.", treatments });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) {
      return res
        .status(404)
        .json({ message: `The treatment with ID ${req.params.id} does not exist.` });
    }
    await Treatment.deleteOne(treatment);
    await Patient.findOneAndUpdate(
      { _id: treatment.prescribedTo },
      { $pull: { treatments: req.params.id } }
    );

    res.status(200).json({ message: "Treatment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const applyTreatment = async (req, res) => {
  try {
    const { treatmentId } = req.body;
    const userAssistant = await User.findOne({ email: req.user.email });
    const assistant = await Assistant.findOne({ user: userAssistant._id });

    const treatment = await Treatment.findById(treatmentId);

    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    treatment.appliedBy = assistant._id;
    await treatment.save();

    res.status(200).json({ message: "Treatment applied successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getPrescribedTreatments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id }).populate("treatments");
    const prescribedTreatments = patient.treatments;
    if (!prescribedTreatments) {
      return res
        .status(404)
        .json({ message: `No treatments found for the patient with ID ${req.params.id}` });
    }
    return res.status(200).json({
      message: `Successfully retrieved prescribed treatments for the patient with ID ${req.params.id}`,
      prescribedTreatments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// A report with all the treatments applied to a Patient

const getAppliedTreatments = async (req, res) => {
  try {
    const appliedTreatments = await Treatment.find({
      appliedBy: { $exists: true },
      prescribedTo: req.params.id,
    });
    if (!appliedTreatments) {
      return res
        .status(404)
        .json({ message: `No applied treatments found for the patient with ID ${req.params.id}` });
    }
    return res.status(200).json({
      message: `Successfully retrieved applied treatments for the patient with ID ${req.params.id}`,
      appliedTreatments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTreatment,
  deleteTreatment,
  applyTreatment,
  getPrescribedTreatments,
  getAllTreatments,
  getAppliedTreatments,
};
