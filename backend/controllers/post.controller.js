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

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({
        message: "Post not found",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        message: "You are not authorized to delete the post",
      });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in delete controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export const commentOnPost = async (req, res) => {
  const { id } = req.params;
  try {
    const { text } = req.body;
    const userId = req.user._id.toString();

    if (!text) {
      return res.status(400).json({ message: "Text filed is required" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    console.log("Error in comment on post controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};
