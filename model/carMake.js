const mongoose = require("mongoose");

const carMake = new mongoose.Schema({
  Make_ID: {
    type: String,
    require: true,
  },
  Make_Name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("CarMake", carMake);
