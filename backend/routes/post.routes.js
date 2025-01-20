import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPost,
  getFollowingPost,
  getLikedPosts,
  getUserPost,
  likeAndUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// fetch all posts
router.get("/all", protectRoute, getAllPost);

// fetch post liked by user
router.get("/getLikedPosts/:id", protectRoute, getLikedPosts);

//fetch the following post
router.get("/following", protectRoute, getFollowingPost);

// fetch the user's post
router.get("/user/:username", protectRoute, getUserPost);

//create post
router.post("/create", protectRoute, createPost);

//delete post
router.delete("/:id", protectRoute, deletePost);

//like and dislike post
router.post("/like/:id", protectRoute, likeAndUnlikePost);

//comment on the post
router.post("/comment/:id", protectRoute, commentOnPost);

export default router;
