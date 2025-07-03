
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/generate', { prompt });
      setHtmlCode(res.data.html);
      setCssCode(res.data.css);
      setJsCode(res.data.js);
    } catch (err) {
      alert('Error generating code');
    }
    setLoading(false);
  };

  const getPreviewSrc = () => {
    return `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">AI Website Builder</h1>

      <div className="mb-4 max-w-3xl mx-auto">
        <textarea
          className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="3"
          placeholder="Describe the website you want (e.g., A personal blog with a contact form)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-3 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Website'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
          <iframe
            title="Live Preview"
            srcDoc={getPreviewSrc()}
            className="w-full h-[500px] border rounded-lg shadow"
          ></iframe>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Edit Code</h2>
          <div className="space-y-4">
            <Editor
              height="200px"
              defaultLanguage="html"
              value={htmlCode}
              onChange={(val) => setHtmlCode(val)}
              theme="vs-light"
            />
            <Editor
              height="200px"
              defaultLanguage="css"
              value={cssCode}
              onChange={(val) => setCssCode(val)}
              theme="vs-light"
            />
            <Editor
              height="200px"
              defaultLanguage="javascript"
              value={jsCode}
              onChange={(val) => setJsCode(val)}
              theme="vs-light"
            />
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          onClick={() => {
            const blob = new Blob([
              `<html><head><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}</script></body></html>`
            ], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ai-generated-site.html';
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download Website
        </button>
      </div>
    </div>
  );
}