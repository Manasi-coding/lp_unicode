import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// protect is a middleware function that protects the routes
export const protect = async (req, res, next) => {
  try {
    let token;

    // check if the token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1]; // token = what comes after Bearer
    }

    // check if the token exists in the cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token; // token = what comes after token
    }

    // check if the token is valid
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // check if the JWT_SECRET is defined in the environment variables
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables"); // stop the execution of the code
    }

    // Verify the token
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id).select("-password"); // find the user by the id and select the password field

    // check if the user is found
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
