import PDFDocument from "pdfkit";
import Document from "../models/docModel.js";

// EXPORT DOCUMENT AS PDF
// GET /documents/:docId/export/pdf

export const exportDocumentPDF = async (req, res) => {
  try {
    const { docId } = req.params;

    const doc = await Document.findById(docId);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${doc.title || "document"}.pdf"`
    );

    // Create PDF
    const pdf = new PDFDocument({ margin: 50 });
    pdf.pipe(res);

    // Title
    pdf
      .fontSize(20)
      .text(doc.title || "Untitled Document", { align: "center" })
      .moveDown(2);

    // Metadata
    pdf
      .fontSize(10)
      .fillColor("gray")
      .text(`Created at: ${doc.createdAt}`)
      .text(`Last updated: ${doc.updatedAt}`)
      .moveDown(2);

    // Content
    pdf
      .fontSize(12)
      .fillColor("black")
      .text(doc.content || "No content", {
        align: "left",
        lineGap: 4,
      });

    // Finalize PDF
    pdf.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
