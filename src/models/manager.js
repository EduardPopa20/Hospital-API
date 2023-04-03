const { Schema, model } = require("mongoose");

const managerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const manager = model("Manager", managerSchema);

module.exports = manager;
