import Document from "../models/docModel.js";
import { askLLM } from "../services/llmService.js";
import appLogger from "../utils/appLogger.js";

export const chatbotController = async (req, res) => {
    try {
        const { documentId, question, type } = req.body;

        if (!documentId || !question) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const doc = await Document.findById(documentId);

        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Access control
        if (
            doc.createdBy.toString() !== req.user.id &&
            !doc.access.view.includes(req.user.id) &&
            !doc.access.edit.includes(req.user.id)
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // 🔥 Handle large documents (VERY IMPORTANT)
        const MAX_LENGTH = 8000;
        const content =
            doc.content.length > MAX_LENGTH
                ? doc.content.slice(0, MAX_LENGTH)
                : doc.content;

        // 🔥 Smart prompt
        let instruction = "Answer the question based on the document.";

        if (type === "summary") {
            instruction = "Provide a clear and concise summary.";
        } else if (type === "suggest") {
            instruction = "Suggest improvements to the document.";
        }

        const prompt = `
You are an AI assistant for document analysis.

Document Title: ${doc.title}
Document Content: ${content}

User Request: ${question}

Instruction: ${instruction}

Rules:
- Do NOT hallucinate
- Stay within document context
- Be clear and structured
`;

        const answer = await askLLM(prompt);

        res.json({ answer });

    } catch (error) {
        appLogger.error("Chatbot Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};