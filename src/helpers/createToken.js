// Global imports
const JWT = require("jsonwebtoken");

// Local imports
const { ENV } = require("../config/env");

exports.createToken = async (data) => {
  try {
    let token = await JWT.sign(data, ENV.JWT_SECRET_KEY);
    return token;
  } catch (error) {
    console.log(error);
    return "";
  }
};
