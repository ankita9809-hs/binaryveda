// Local impports
const { Users } = require("../models/user");
const { createToken } = require("../helpers/createToken");
const { encryptData, decryptData } = require("../helpers/crypto");
const {
  clientErrorResponse,
  successResponse,
  serverErrorResponse,
} = require("../helpers/response");

const getUser = async (query = {}, project = {}) => {
  try {
    const getData = await Users.find(query, project);
    return getData;
  } catch (error) {
    return [];
  }
};

exports.signin = async (req, res) => {
  try {
    if (!req.body.name) return clientErrorResponse(res, "Required Name!");
    if (!req.body.email) return clientErrorResponse(res, "Required Email!");

    const e = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!e.test(req.body.email))
      return clientErrorResponse(res, "Invalid Email");

    const checkEmail = await getUser({ email: req.body.email });
    if (checkEmail.length > 0)
      return clientErrorResponse(res, "Email Already Exist!");

    if (!req.body.password)
      return clientErrorResponse(res, "Required Password!");

    if (req.body.password !== req.body.confirmPassword)
      return clientErrorResponse(res, "Password Not matched!");

    if (!req.body.mobile) return clientErrorResponse(res, "Required Mobile!");

    const m = /^\+?[1-9]\d{1,13}$/;
    if (!m.test(req.body.mobile))
      return clientErrorResponse(res, "Invalid Mobile Number");

    const checkMobile = await getUser({ mobile: req.body.mobile });
    if (checkMobile.length > 0)
      return clientErrorResponse(res, "Mobile Already Exist!");

    req.body.password = await encryptData(req.body.password);

    if (!req.body.age) return clientErrorResponse(res, "Required Age!");
    if (!req.body.address) return clientErrorResponse(res, "Required Address!");
    if (!req.body.gender) return clientErrorResponse(res, "Required Gender!");
    if (!req.body.dob)
      return clientErrorResponse(res, "Required Date of Birth!");

    const addUser = await Users.create(req.body);
    if (!addUser) return clientErrorResponse(res, "User Not Created!");

    return successResponse(res, "User Created Successfully!");
  } catch (error) {
    console.log(error);

    return serverErrorResponse(res);
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body.email) return clientErrorResponse(res, "Required Email!");
    if (!req.body.password)
      return clientErrorResponse(res, "Required Password!");

    const getData = await getUser(
      { email: req.body.email },
      { isDeleted: 0, lastLoggedIn: 0, createdAt: 0, updatedAt: 0 }
    );
    if (getData.length === 0)
      return clientErrorResponse(res, "Email Not Exist!");

    const decryptPassword = await decryptData(getData[0].password);

    if (req.body.password !== decryptPassword)
      return clientErrorResponse(res, "Wrong Password!");

    let { password, authkey, createdAt, updatedAt, ...rest } = getData[0]._doc;

    let token = await createToken(rest);
    rest.token = token;

    await Users.updateOne(
      { _id: rest._id },
      { $set: { authkey: token, lastLoggedIn: Date.now() } },
      { new: true }
    );

    return successResponse(res, "User Login Successfully!", rest);
  } catch (error) {
    return serverErrorResponse(res);
  }
};
