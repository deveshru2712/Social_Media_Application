import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.auth;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decode = jwt.verify(token, process.env.JWT_KEY);
    if (!decode) {
      return res.status(400).json({ error: "Unauthorized:Invalid Token" });
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protect Route :", error.message);
    res.status(500).json({ error: "Internal server error " });
  }
};

export default protectRoute;
