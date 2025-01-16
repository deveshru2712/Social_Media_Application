import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPost,
  getFollowingPost,
  getLikedPosts,
  likeAndUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/getPosts", protectRoute, getAllPost);
router.get("/getLikedPosts/:id", protectRoute, getLikedPosts);

router.get("/followingPosts", protectRoute, getFollowingPost);

router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);

router.post("/like/:id", protectRoute, likeAndUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);

export default router;
