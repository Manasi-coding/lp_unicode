import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import appLogger from "../utils/appLogger.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askLLM = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text();

    } catch (error) {
        appLogger.error("LLM Error:", error);
        throw error;
    }
};