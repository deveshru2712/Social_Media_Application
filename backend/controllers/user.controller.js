import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export const getSuggestedUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const followedUser = await User.findById(userId).select("following");

    const user = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }, // this one filet out the userId of the current user itself
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUser = user.filter(
      (users) => !followedUser.following.includes(users._id)
    );

    const suggestedUsers = filteredUser.slice(0, 4);

    suggestedUsers.forEach((element) => {
      element.password = null;
    });

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(
      "Error in get Suggested User Profile  controllers:",
      error.message
    );
    res.status(500).json({ error: "Internal server error " });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToFollow = await User.findById(id);

    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can'nt follow yourself" });
    }

    const isFollowed = currentUser.following.includes(id);
    if (isFollowed) {
      //pull is use to remove all instances

      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      const newNotification = await Notification.create({
        type: "unfollow",
        from: req.user._id,
        to: userToFollow._id,
      });

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = await Notification.create({
        type: "follow",
        from: req.user._id,
        to: userToFollow._id,
      });

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log(
      "Error in get follow Unfollow User  controllers:",
      error.message
    );
    res.status(500).json({ error: "Internal server error " });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      currentPassword,
      newPassword,
      Bio,
      link,
    } = req.body;

    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password should be of 6 character" });
      }

      const isCorrect = await bcrypt.compare(currentPassword, user.password);

      if (!isCorrect) {
        return res.status(400).json({ error: "Wrong Password" });
      }

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      try {
        const uploadedResponse = await cloudinary.uploader.upload(profileImg);
        profileImg = uploadedResponse.secure_url;
      } catch (error) {
        console.log("unable to update the profile image:", error.message);
        return res.status(500).json({ message: "unable to update the image" });
      }
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      try {
        const uploadedResponse = await cloudinary.uploader.upload(coverImg);
        coverImg = uploadedResponse.secure_url;
      } catch (error) {
        console.log("unable to update the cover image:", error.message);
        return res.status(500).json({ message: "unable to update the image" });
      }
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.Bio = Bio || user.Bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in get update User Profile controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};
