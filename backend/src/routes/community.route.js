import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCommunities,
  getCommunity,
  createCommunity,
  joinCommunity,
  leaveCommunity,
  updateCommunity,
  deleteCommunity,
  removeMemberFromCommunity,
} from "../controllers/community.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Community routes
router.get("/", getCommunities);
router.get("/:id", getCommunity);
router.post("/", createCommunity);
router.put("/:id", updateCommunity);
router.delete("/:id", deleteCommunity);
router.post("/:id/join", joinCommunity);
router.post("/:id/leave", leaveCommunity);
router.post("/:id/remove-member", removeMemberFromCommunity);

export default router;
