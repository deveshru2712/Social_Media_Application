import jwt from "jsonwebtoken";

const genToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "1day",
  });

  res.cookie("auth", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export default genToken;
