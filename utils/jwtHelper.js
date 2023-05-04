const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
// ========================
dotenv.config();

// ========================
exports.generateJwtToken = (data) => {
  const secretKey = process.env.SECRET_KEY;
  const options = {
    algorithm: "HS256",
  };
  return JWT.sign(data, secretKey, options);
};
// ==========================
exports.decodeJwtToken = (token) => {
  const secretKey = process.env.SECRET_KEY;
  return JWT.verify(token, secretKey);
};
