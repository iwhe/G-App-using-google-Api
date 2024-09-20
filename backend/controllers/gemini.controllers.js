import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "../utils/asyncHandler.js";

const askGemini = asyncHandler(async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // console.log("request body::S:", req?.body);

    const prompt = req?.body?.prompt;

    const result = await model.generateContent(prompt);
    res.status(200).json(result.response.text());
  } catch (error) {
    console.log("Error while asking gemini API");
  }
});

export default askGemini;
