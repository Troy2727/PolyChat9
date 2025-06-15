import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getThreads,
  getThread,
  createThread,
  addComment,
  likeThread,
  repostThread,
  deleteThread,
  voteThread,
  bookmarkThread,
  editThread,
} from "../controllers/thread.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Thread routes
router.get("/", getThreads);
router.get("/:id", getThread);
router.post("/", createThread);
router.put("/:id", editThread);
router.post("/:id/comments", addComment);
router.post("/:id/like", likeThread);
router.post("/:id/repost", repostThread);
router.post("/:id/vote", voteThread);
router.post("/:id/bookmark", bookmarkThread);
router.delete("/:id", deleteThread);

export default router;
