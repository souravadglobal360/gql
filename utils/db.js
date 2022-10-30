const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.database);

  console.log(`MongoDB Connected: ${conn.connection.port}`);
};

module.exports = connectDB;
