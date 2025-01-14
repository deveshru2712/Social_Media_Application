import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../Utils/genToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ error: "UserName already taken" });
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
      userName,
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
    res.status(400).json({ error: "Internal server error " });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({
        error: "This userName is not associated with any account",
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
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in login controllers:", error.message);
    res.status(400).json({ error: "Internal server error " });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("auth", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in login controllers:", error.message);
    res.status(400).json({ error: "Internal server error " });
  }
};
