const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// API 1: GET /register/verifyUser
app.get("/register/verifyUser", (req, res) => {
  res.status(200).json({
    status: "success",
    isregistered: "NO",
  });
});

// API 2: GET /NewSignIn/registerOtp
app.get("/NewSignIn/registerOtp", (req, res) => {
  res.status(200).json({
    status: "success",
    message:
      "The one-time password(OTP) is sent to the registered mobile number.",
    requestid: "980C7EE64BBF893",
  });
});

// API 3: POST /NewSignIn/verifyOtp
app.post("/NewSignIn/verifyOtp", (req, res) => {
  res.status(200).json({
    status: "SUCCESS",
    message: "You are successfully logged in",
    mobileno: "9528717894",
    email: null,
    username: " ",
    mobile_verification_status: 0,
    email_verification_status: 0,
    custcode: "R000C",
    logout: false,
    authToken:
      "dd13dd8b35bf26856abea304ec5c08a4348d43ca04c94fbde1d8bcf2c6909b3c",
  });
});

// API 4: POST /NewSignIn/createMPIN
app.post("/NewSignIn/createMPIN", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "M-Pin created.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
