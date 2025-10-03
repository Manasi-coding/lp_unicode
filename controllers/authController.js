import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, dob, credit_scores, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const check = await User.findOne({ email });
    if (check) return res.status(400).json({ message: "User already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      dob,
      credit_scores,
      password: hashedPwd,
    });

    if (!newUser) return res.status(400).json({ message: "User not created" });

    await sendEmail({
      to: newUser.email,
      subject: "Welcome to Unicode App",
      message: "Welcome to Unicode App",
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "Registration Successful!",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        dob: newUser.dob,
        credit_scores: newUser.credit_scores,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const check = await User.findOne({ email });
    if (!check)
      return res.status(400).json({ message: "Invalid email or password!" });

    const isMatch = await bcrypt.compare(password, check.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password!" });

    const token = generateToken(check._id);

    await sendEmail({
      to: check.email,
      subject: "Welcome to my app",
      message: "Welcome to my app",
    });

    res.status(200).json({
      message: "Login Successful!",
      token,
      user: {
        _id: check._id,
        name: check.name,
        email: check.email,
        dob: check.dob,
        credit_scores: check.credit_scores,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
