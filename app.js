const express = require("express");
const mongoose = require("mongoose");
const jwtHelper = require("./utils/jwtHelper");
const dotenv = require("dotenv");
const User = require("./model/userModel.js");
const cookieParser = require("cookie-parser");
const colors = require("colors");

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose
  .connect(process.env.URI_MONGO)
  .then(() => {
    console.log("Connected To DataBase".bgGreen.bold);
  })
  .catch((err) => {
    console.log(err);
  });
// ======================= MiddleWares

app.post("/signup", async (req, res) => {
  const {email, password} = req.body;

  const newUser = await User.create({email, password});
  const jwtToken = jwtHelper.generateJwtToken({user_id: newUser._id});

  // cookie
  res.cookie("token", jwtToken).status(201).json({
    status: "OK",
    message: "User has been created.",
  });
});

app.get("/login", async (req, res) => {
  const token = req.cookies.token;
  const UserId = jwtHelper.decodeJwtToken(token);
  const user = await User.find({_id: UserId.user_id});
  console.log(UserId);
  if (user) {
    res.status(201).json({
      status: "true",
      message: "OK",
      user: user,
    });
  } else {
    res.status(404).json({
      sucess: false,
      status: "Authorization Faild",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is connected at ${process.env.PORT}`.bgBlue.bold);
});
