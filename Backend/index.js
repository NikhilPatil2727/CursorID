import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize GoogleGenAI with API key
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY
});

app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    // ✅ Correct usage of `contents` for generateContent
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
                You are an expert web developer. Create a complete, functional website based on the following description: 
                "${prompt}"

                Return ONLY a JSON object with these keys:
                - html: complete HTML code
                - css: complete CSS code
                - js: complete JavaScript code

                Requirements:
                1. The website must be fully responsive
                2. Use modern, clean design
                3. Include all necessary functionality
                4. No placeholders - use actual content
              `
            }
          ]
        }
      ]
    });

    // ✅ Extract text response
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ✅ Parse JSON content safely
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);

    const code = JSON.parse(jsonString);
    res.json(code);
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate website' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
