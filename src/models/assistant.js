const { Schema, model } = require("mongoose");

const assistantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    cascade: true,
  },
  assignedPatients: [
    {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
});

const Assistant = model("Assistant", assistantSchema);

module.exports = Assistant;
