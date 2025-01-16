import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
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

export const likeAndUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });

      //  update it in the user's liked post array

      const newNotification = await Notification.create({
        from: userId,
        to: post.user,
        type: "unlike",
      });

      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: id } });

      res.status(200).json({ message: "post unliked" });
    } else {
      post.likes.push(userId);

      await User.findByIdAndUpdate(userId, { $push: { likedPosts: id } });

      await post.save();

      const newNotification = await Notification.create({
        from: userId,
        to: post.user,
        type: "like",
      });

      res.status(200).json({ message: "post like" });
    }
  } catch (error) {
    console.log("Error in like and unlike controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export const getAllPost = async (req, res) => {
  try {
    //sort({ createdAt: -1 })-> this returns the latest post at the top

    // populate -> this returns the user so that we can fetch necessary info of the user
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (posts.length == 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in get all post controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json(likedPosts);
  } catch (error) {
    console.log(
      "Error in comment on get all like post controllers:",
      error.message
    );
    res.status(500).json({ error: "Internal server error " });
  }
};

export const getFollowingPost = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-select",
      });

    return res.status(200).json(feedPosts);
  } catch (error) {
    console.log(
      "Error in comment on get following post controllers:",
      error.message
    );
    res.status(500).json({ error: "Internal server error " });
  }
};

export const getUserPost = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-select",
      });
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in get user's post controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};
