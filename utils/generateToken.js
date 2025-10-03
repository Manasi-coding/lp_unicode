import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const generateToken = (userId, email) => {
  //if (!SECRET_KEY) throw new Error("JWT_SECRET is not defined in .env");

  return jwt.sign(
    { id: userId, email }, // payload
    SECRET_KEY,
    { expiresIn: "30d" }
  );
};
