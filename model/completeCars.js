const mongoose = require("mongoose");

const completeCars = new mongoose.Schema({
  Make_ID: {
    type: [String],
    require: true,
  },
  Make_Name: {
    type: [String],
    require: true,
  },
  vehicleTypes: [],
});

module.exports = mongoose.model("CompleteCar", completeCars);
