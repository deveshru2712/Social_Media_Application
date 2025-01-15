import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPost,
  likeAndUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/getPosts", protectRoute, getAllPost);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeAndUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);

export default router;
