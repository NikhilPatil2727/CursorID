// server.js

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize GoogleGenerativeAI with API key
// NOTE: The class name has been updated to GoogleGenerativeAI in recent versions
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Get a generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ✅ RE-ENGINEERED PROMPT for a predictable frontend preview
    const fullPrompt = `
      You are an expert React.js developer specializing in creating single-file applications with Tailwind CSS.
      Create a complete, fully functional single-page application (SPA) using React.js based on the following description: "${prompt}"

      **RESPONSE REQUIREMENTS:**

      1.  **FRAMEWORK:** Use React 19 with functional components and hooks.
      2.  **STYLING:** Use Tailwind CSS classes directly in the JSX. Do not use custom CSS files unless absolutely necessary for global styles (like fonts or background colors).
      3.  **STRUCTURE:** Respond ONLY with a raw, valid JSON object. Do not include markdown, explanations, or any text outside the JSON object.
      4.  **COMPONENTS:** Define all components within a single string. The main component MUST be named "App". Do not use local import/export statements between components.
      5.  **RENDERING:** Do NOT include the \`ReactDOM.createRoot\` or \`root.render(<App />)\` calls. The host environment will handle rendering.
      6.  **CONTENT:** The application must be complete and visually appealing with real content, not placeholders.

      **JSON OUTPUT FORMAT:**
      {
        "jsx": "A single string containing all React code. The main component must be named 'App'. All other components should be defined above it in the same string.",
        "css": "A string containing any necessary global CSS. If using only Tailwind classes, this can be an empty string or contain base styles like body background."
      }
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // ✅ Clean response (remove code blocks and trim)
    const cleanedText = text
      .replace(/```(?:json|js|javascript)?/gi, '')
      .replace(/```/g, '')
      .trim();

    // ✅ Try parsing cleaned JSON string
    let code;
    try {
      code = JSON.parse(cleanedText);
      // Basic validation
      if (typeof code.jsx !== 'string' || typeof code.css !== 'string') {
          throw new Error("Invalid JSON structure from AI. Missing 'jsx' or 'css' keys.");
      }
    } catch (err) {
      console.error("JSON parsing failed. Raw response was:\n", cleanedText);
      return res.status(500).json({ error: 'Invalid JSON format from AI', details: err.message, raw: cleanedText });
    }

    res.json(code);

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate website' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});