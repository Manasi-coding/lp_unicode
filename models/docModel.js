import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    access: {
      view: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      edit: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    tags: [{ type: String }],
    requests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["view", "edit"], required: true },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
