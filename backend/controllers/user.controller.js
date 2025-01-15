import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName }).select("-password");
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

export const updateUserProfile = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error in get update User Profile controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};
