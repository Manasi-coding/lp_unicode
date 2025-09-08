import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const generateToken = (userID) => {
  return jwt.sign(
    { id: user._id, email: userID.email }, // PAYLOAD
    SECRET_KEY, // SECRET KEY
    { expiresIn: "30d" } // EXIRY TIME (OPTIONS)
  );
  // Function to verify a JWT token
};

// Function to verify a JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
    // Valid & unexpired → Returns the payload
  } catch (err) {
    return null; // Invalid token
    // Expired: Throws an error
    // Tampered or invalid: Throws an error
  }
};
