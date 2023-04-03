const { Schema, model } = require("mongoose");

const treatmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    required: true,
    trim: true,
  },
  appliedBy: {
    type: Schema.Types.ObjectId,
    ref: "Assistant",
  },
  prescribedBy: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  prescribedTo: {
    type: Schema.Types.ObjectId,
    ref: "Pacient",
    required: true,
  },
});

const Treatment = model("Treatment", treatmentSchema);

module.exports = Treatment;
