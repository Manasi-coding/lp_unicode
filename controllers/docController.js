import Document from "../models/docModel.js";
import { createVersionSnapshot } from "./versionController.js";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/userModel.js";

// CREATE DOC
export const createDoc = async (req, res) => {
  try {
    const newDoc = await Document.create({
      title: req.body.title,
      content: req.body.content || "", // optional field
      createdBy: req.user.id,
    });
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET DOCS VISIBLE TO THE LOGGED IN USER
export const getDocs = async (req, res) => {
  try {
    const userId = req.user.id;

    const docs = await Document.find({
      $or: [
        { createdBy: userId },
        { "access.view": userId },
        { "access.edit": userId },
      ],
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE DOC (OWNER OR EDITOR ONLY)
export const updateDoc = async (req, res) => {
  try {
    const docId = req.params.docId;
    const { title, content } = req.body;
    const userId = req.user.id;

    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ message: "Document not found!" });

    if (
      doc.createdBy.toString() !== userId &&
      !doc.access.edit.includes(userId)
    ) {
      return res
        .status(403)
        .json({ message: "No permission to edit this document!" });
    }

    await createVersionSnapshot(doc, userId);

    if (title) doc.title = title;
    if (content !== undefined) doc.content = content;

    await doc.save();
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE DOC (OWNER ONLY)
export const deleteDoc = async (req, res) => {
  try {
    const docId = req.params.docId;
    const userId = req.user.id;

    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ message: "Document not found!" });

    if (doc.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No permission to delete this document!" });
    }

    await doc.deleteOne();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REQUEST ACCESS (VIEW/EDIT)
export const requestAccess = async (req, res) => {
  try {
    const docId = req.params.docId;
    const { type } = req.body;
    const userId = req.user.id;

    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ message: "Document not found!" });

    const existingRequest = doc.requests.find(
      (r) =>
        r.user.toString() === userId &&
        r.type === type &&
        r.status === "pending"
    );
    if (existingRequest)
      return res.status(400).json({ message: "Request already pending!" });

    doc.requests.push({ user: userId, type, status: "pending" });

    await doc.save();

    // notify the owner
    const owner = await User.findById(doc.createdBy);

    sendEmail({
      to: owner.email,
      subject: "New document access request",
      message: `User ${req.user.id} has requested ${type} access to your document "${doc.title}".`,
    }).catch((err) => {
      console.error("Access request email failed:", err.message);
    });

    res.status(200).json({ message: "Access request sent!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// APPROVE/REJECT A REQUEST (OWNER ONLY)
export const approveAccess = async (req, res) => {
  try {
    const { docId, requestId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ message: "Document not found!" });

    if (doc.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the owner can approve/reject requests!" });
    }

    const request = doc.requests.id(requestId);
    if (!request)
      return res.status(404).json({ message: "Request not found!" });

    request.status = status;
    if (status === "approved") {
      if (request.type === "view" && !doc.access.view.includes(request.user)) {
        doc.access.view.push(request.user);
      } else if (
        request.type === "edit" &&
        !doc.access.edit.includes(request.user)
      ) {
        doc.access.edit.push(request.user);
      }
    }

    await doc.save();
    res.status(200).json({ message: `Request ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD USER ACCESS (OWNER ONLY)
export const addUserAccess = async (req, res) => {
  try {
    const docId = req.params.docId;
    const { userId, type } = req.body;
    const ownerId = req.user.id;

    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ message: "Document not found!" });

    if (doc.createdBy.toString() !== ownerId) {
      return res
        .status(403)
        .json({ message: "Only the owner can add user access!" });
    }

    if (type === "view" && !doc.access.view.includes(userId)) {
      doc.access.view.push(userId);
    } else if (type === "edit" && !doc.access.edit.includes(userId)) {
      doc.access.edit.push(userId);
    }

    await doc.save();
    res.status(200).json({ message: `User added with ${type} access` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
