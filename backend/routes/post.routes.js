import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.delete("/", protectRoute);
router.post("/like/:id", protectRoute);
router.post("/comment/:id", protectRoute);

export default router;
