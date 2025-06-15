import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
  updateProfile,
  forgotPassword,
  resetPassword,
  firebaseSignIn,
  linkedInExchange
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Test endpoint
router.get("/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ message: "Test endpoint working" });
});

// Firebase authentication routes
router.post("/firebase-signin", firebaseSignIn);
router.post("/linkedin-exchange", linkedInExchange);

router.post("/onboarding", protectRoute, onboard);
router.put("/profile", protectRoute, updateProfile);

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
