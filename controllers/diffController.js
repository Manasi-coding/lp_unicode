import { diffLines } from "diff"; // compares two blocks of text line by line and tells you what changed
import DocVersion from "../models/versionModel.js";

// get the difference between the two documents
// GET /documents/:docId/diff/:from/:to
export const diffVersions = async (req, res) => {
  try {
    const { docId, from, to } = req.params;

    // version numbers must be numbers
    const fromVersionNumber = Number(from);
    const toVersionNumber = Number(to);

    // check if they are numbers
    if (isNaN(fromVersionNumber) || isNaN(toVersionNumber))
      return res
        .status(400)
        .json({ message: "The version numbers must be valid numbers" });

    // fetch both the versions
    const fromVersion = await DocVersion.findOne({
      documentId: docId,
      versionNumber: fromVersionNumber,
    });
    const toVersion = await DocVersion.findOne({
      documentId: docId,
      versionNumber: fromVersionNumber,
    });

    if (!fromVersion || !toVersion)
      return res
        .status(404)
        .json({ message: "Either or both the versions not found" });

    // compute line-by-line diff
    const diff = diffLines(fromVersion.content, toVersion.content);

    res.status(200).json({
      success: true,
      documentId: docId,
      from: fromVersionNumber,
      to: toVersionNumber,
      diff,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
