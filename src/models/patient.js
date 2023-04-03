const { Schema, model } = require("mongoose");

const patientSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  medicalProblems: [
    {
      type: String,
      trim: true,
    },
  ],
  assignedAssistants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Assistants",
    },
  ],
  assignedDoctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
  treatments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Treatment",
    },
  ],
});

const Patient = model("Patient", patientSchema);

module.exports = Patient;
