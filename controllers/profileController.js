import cloudinary from "../config/cloudinary";
import User from "../models/userModel";
import fs from "fs"; // file system (to read, write, delete, and create)

export const uploadProfileIcon = async (req, res) => {
  try {
    // check if file is uploaded
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded!" });

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pics", // folder in Cloudinary
    });

    // update the profile_pic field with the cloudinary url
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profile_pic: result.secure_url },
      { new: true }
    );

    // delete the temp file
    fs.unlinkSync(req.file.path);

    // display the new user info
    res.json({
      message: "Profile picture updated successfully",
      profile_pic: result.secure_url,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
