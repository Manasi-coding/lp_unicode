import { searchDocuments } from "../services/searchService.js";
import appLogger from "../utils/appLogger.js";

export const searchController = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ message: "Query required" });
        }

        const results = await searchDocuments(q);

        res.json(results);

    } catch (error) {
        appLogger.error("Search Error:", error);
        res.status(500).json({ message: "Search failed" });
    }
};