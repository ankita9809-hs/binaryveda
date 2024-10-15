const mongoose = require("mongoose");

const { ENV } = require("./env");

exports.connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(ENV.MONGO_URI);
    console.log("Database Connected!");
  } catch (error) {
    console.log("Database not Connected!");
    console.log(error.message);
  }
};
