import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'https://astonishing-brioche-b2cfa1.netlify.app', // Your Netlify domain
    'http://localhost:3000' // For local development
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Initialize GoogleGenAI with API key
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Pre-flight OPTIONS handler
app.options('/generate', cors(corsOptions));

app.post('/generate', async (req, res) => {
  try {
    // Validate request
    if (!req.body?.prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const { prompt } = req.body;

    // Validate prompt length
    if (prompt.length > 1000) {
      return res.status(400).json({ error: 'Prompt too long (max 1000 chars)' });
    }

    // Send generation request
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

Respond ONLY with a valid JSON object with these keys:
- html: complete HTML code
- css: complete CSS code
- js: complete JavaScript code

Requirements:
1. The website must be fully responsive
2. Use modern, clean design
3. Include all necessary functionality
4. No placeholders - use actual content
5. No explanations or markdown formatting. Only return a raw JSON object.
              `.trim()
            }
          ]
        }
      ],
      safetySettings: {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_ONLY_HIGH"
      }
    });

    // Extract and clean response
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanedText = text
      .replace(/```(?:json|js|javascript)?/gi, '')
      .replace(/```/g, '')
      .trim();

    // Parse and validate response
    let code;
    try {
      code = JSON.parse(cleanedText);
      if (!code.html || !code.css || !code.js) {
        throw new Error('Missing required code fields');
      }
    } catch (err) {
      console.error("JSON parsing failed. Raw response:\n", cleanedText);
      return res.status(500).json({ 
        error: 'Invalid response format from AI',
        details: err.message
      });
    }

    res.json(code);
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate website',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});