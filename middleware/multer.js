import multer from "multer";
import path from "path"; // extract the file extension

// destination function: tells Multer where to save the uploaded file
// filename function: tells Multer how to name the file
// cb: callback function (function called when an asynchronous operation finishes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // saves the file in a folder named "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ensures that the name is always unique
  },
});

const upload = multer({ storage });
export default upload;
