const { Schema, model } = require("mongoose");

const doctorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedPatients: [
    {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
});

const Doctor = model("Doctor", doctorSchema);

module.exports = Doctor;
