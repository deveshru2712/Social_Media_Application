import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  const userId = req.user._id;
  try {
    const { text } = req.body;
    let { img } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or an image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = await Post.create({
      user: userId,
      text,
      img,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in get create post controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};
