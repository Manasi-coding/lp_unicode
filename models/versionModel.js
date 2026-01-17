import mongoose from "mongoose";

const docVersionSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doc",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // gives createdAt (important for history)
  }
);

const DocVersion = mongoose.model("DocVersion", docVersionSchema);
export default DocVersion;
