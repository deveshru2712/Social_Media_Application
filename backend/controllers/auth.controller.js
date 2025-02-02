import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../Utils/genToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "Please provide all inputs" });
    }

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "username already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 character" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      genToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ error: "invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Please provide all inputs" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: "This username is not associated with any account",
      });
    }

    const checkPassword = await bcrypt.compare(password, user?.password || "");
    if (!checkPassword) {
      return res.status(400).json({
        error: "Incorrect password !",
      });
    }

    genToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in login controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("auth", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controllers:", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};
