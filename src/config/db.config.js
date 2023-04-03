const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const atlas_url = process.env.ATLAS_URL;

mongoose.connect(atlas_url);
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Successfully connected to database!");
});

module.exports = connection;
