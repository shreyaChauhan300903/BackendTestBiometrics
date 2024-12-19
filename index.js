const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const HOST = "10.160.0.96";
const otpStorage = new Map();

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});

// Add CORS middleware
app.use(
  cors({
    origin: "*", // In production, replace with your specific frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Middleware to parse JSON
app.use(bodyParser.json());

// API 1: GET /register/verifyUser
app.get("/register/verifyUser", (req, res) => {
  res.status(200).json({
    status: "success",
    isregistered: "NO",
    is_mpin_exists: true,
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

// API 5: POST /login/verifyUser
app.post("/login/verifyUser", (req, res) => {
  res.status(200).json({
    status: "success",
    isregistered: "YES",
    is_mpin_exists: true,
  });
});

// API 6: POST /verifympin
app.post("/verifympin", (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

// API 7: POST /generateOtp
app.post("/generateOtp", (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const requestId = crypto.randomBytes(16).toString("hex");

  otpStorage.set(requestId, otp);

  res.status(200).json({
    status: "success",
    otp: otp,
    requestid: requestId,
  });
});

// API 8: POST /verifyOtp
app.post("/verifyOtp", (req, res) => {
  const { otp } = req.body;

  // Check if the OTP exists in otpStorage
  const requestId = [...otpStorage.entries()].find(
    ([_, storedOtp]) => storedOtp === otp
  )?.[0];

  if (requestId) {
    res.status(200).json({
      status: "success",
      message: "OTP verified successfully.",
    });
  } else {
    res.status(400).json({
      status: "error",
      message: "Invalid OTP.",
    });
  }
});

// API 9: POST CreateKey  STORING public key
const userKeys = {}; // Store user public keys (use a database in production)

app.post("/register-key", (req, res) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).send({ message: "Public key is required" });
    }

    const userId = "user-unique-id"; // Replace with real user identification logic
    userKeys[userId] = publicKey;

    res.status(200).send({ message: "Public key registered" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

// API 10: POST Verify Signature
app.post("/verify-signature", (req, res) => {
  try {
    const { payload, signature } = req.body;

    if (!payload || !signature) {
      return res
        .status(400)
        .send({ message: "Payload and signature are required" });
    }

    const userId = "user-unique-id"; // Replace with logic to identify the user
    const publicKey = userKeys[userId]; // Retrieve the user's public key from storage

    if (!publicKey) {
      return res.status(404).send({ message: "Public key not found for user" });
    }

    // Create verifier with specific algorithm
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(Buffer.from(payload));

    try {
      // Make sure the public key is in PEM format
      const isVerified = verifier.verify(
        `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
        Buffer.from(signature, "base64")
      );

      return res.status(200).send({ verified: isVerified });
    } catch (verifyError) {
      console.error("Verification error:", verifyError);
      return res.status(400).send({
        verified: false,
        message: "Invalid signature format or public key",
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});
