const Assistant = require("../models/assistant");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const createAssistant = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, address, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Assistanta already exists." });
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
    const assistant = await Assistant.create({ user: newUser._id });
    res.status(201).json({ message: "Assistant created successfully.", assistant });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const deleteAssistantById = async (req, res) => {
  try {
    const assistant = await Assistant.findByIdAndDelete(req.params.id);
    if (!assistant) {
      return res
        .status(404)
        .json({ message: `Assistant with ID ${req.params.id} does not exist.` });
    }
    await User.findByIdAndDelete(assistant.user);
    res.status(200).json({ message: `Assistant with ID ${req.params.id} successfully deleted.` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateAssistantById = async (req, res) => {
  try {
    const updatedAssistant = await Assistant.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedAssistant) {
      return res
        .status(404)
        .json({ message: `Assistant with ID ${req.params.id} does not exist.` });
    }
    res.status(200).json({
      message: `Assistant with ID ${req.params.id} successfully updated.`,
      updatedAssistant,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAssistantById = async (req, res) => {
  try {
    const assistant = await Assistant.findById(req.params.id).populate("user", "-password ");
    if (!assistant) {
      return res
        .status(404)
        .json({ message: `Assistant with ID ${req.params.id} does not exist.` });
    }
    res
      .status(200)
      .json({ message: `Assistant with ID ${req.params.id} returned successfully.`, assistant });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllAssistants = async (req, res) => {
  try {
    const assistants = await Assistant.find().populate("user", "-password");
    res.status(200).json(assistants);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createAssistant,
  getAllAssistants,
  getAssistantById,
  updateAssistantById,
  deleteAssistantById,
};
