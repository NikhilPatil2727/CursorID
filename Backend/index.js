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
You are an expert React.js developer specializing in building highly professional, production-ready single-file applications (SPA) using React 19 and Tailwind CSS.

Your task is to create a complete, visually stunning, fully functional single-page application based on the following description:
"Create a modern, clean, and professional-grade web application with elegant UI/UX design. It should look ready for real-world deployment. Use advanced layout principles, interactive components, and follow accessibility and responsiveness best practices. ${prompt}"

**OUTPUT INSTRUCTIONS:**

1. **FRAMEWORK**: Use React 19 functional components with Hooks only.
2. **STYLING**: Use Tailwind CSS classes directly in the JSX. Do NOT use separate CSS files unless absolutely required (e.g., for fonts or dark mode).
3. **STRUCTURE**: Return ONLY a valid JSON object (no explanations, no extra text).
4. **COMPONENTS**: All components must be defined in one string. The main component MUST be called \`App\`. Do NOT use import/export between components.
5. **RENDERING**: Omit \`ReactDOM.createRoot\` and any root rendering logic. The host environment will handle rendering.
6. **UI/UX**: Focus on polished layout, consistent spacing, modern typography, hover effects, animations (e.g., with Framer Motion or Tailwind transitions), responsiveness, and good color usage.
7. **CONTENT**: Use realistic and meaningful content (not placeholders like "Lorem Ipsum" or "Title here").

**OUTPUT FORMAT (JSON):**
{
  "jsx": "A single string containing all React code with the 'App' component at the bottom. Other components must be defined above it.",
  "css": "A string containing any optional global styles (can be empty if only Tailwind is used)."
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