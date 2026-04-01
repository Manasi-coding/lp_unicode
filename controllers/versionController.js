import Document from "../models/docModel.js";
import DocVersion from "../models/versionModel.js";

// Save current document state as a version before update
export const createVersionSnapshot = async (document, editedBy) => {
  try {
    const docId = document._id;
    const latestVersion = await DocVersion.findOne({ documentId: docId }).sort({
      versionNumber: -1,
    }); // sorts the version numbers in descending order... will give the latest version

    const nextVersionNumber = latestVersion
      ? latestVersion.versionNumber + 1
      : 1;

    // save the snapshot as a new version
    await DocVersion.create({
      documentId: document._id,
      content: document.content,
      editedBy,
      versionNumber: nextVersionNumber,
    });
  } catch (err) {
    throw err; // re-throw so the calling controller can handle the error
  }
};

// get version history
export const getVersionHistory = async (req, res) => {
  try {
    const docId = req.params.docId;

    const versions = await DocVersion.find({ documentId: docId })
      .sort({ versionNumber: 1 }) // ascending order
      .select("-__v"); // Exclude the __v field

    res.status(200).json({
      success: true,
      versions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// restore a version
export const restoreVersion = async (req, res) => {
  try {
    const { docId, versionId } = req.params;
    const userId = req.userId;

    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ message: "Document not found!" });

    if (
      doc.createdBy.toString() !== userId &&
      !doc.access.edit.includes(userId)
    ) {
      return res
        .status(403)
        .json({ message: "No permission to restore this document!" });
    }

    const version = await DocVersion.findById(versionId);
    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    // create the snapshot of the current state before restoring
    await createVersionSnapshot(doc, userId);

    // restore the content
    doc.content = version.content;
    doc.updatedAt = new Date();

    await doc.save();

    res.status(200).json({
      success: true,
      message: "Document restored successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
