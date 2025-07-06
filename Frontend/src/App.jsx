// src/App.jsx

import React, { useState } from 'react';
import CodePreview from './components/CodePreview';
import CodeViewer from './components/CodeViewer';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) {
      setError('Please enter a description for the app you want to build.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'An unknown error occurred on the server.');
      }

      const data = await response.json();
      setGeneratedCode(data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="flex-shrink-0 text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">AI React App Generator</h1>
        <p className="text-slate-400 mt-2">Describe the app you want to build, and watch it come to life.</p>
      </header>

      <main className="flex-grow flex flex-col">
        <form onSubmit={handleSubmit} className="flex-shrink-0 mb-8 max-w-4xl w-full mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., a modern to-do list app with add, delete, and toggle complete features"
              className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 resize-none"
              rows="3"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate App'
              )}
            </button>
          </div>
          {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
        </form>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[60vh]">
          {generatedCode ? (
            <>
              <CodePreview jsx={generatedCode.jsx} css={generatedCode.css} />
              <CodeViewer jsx={generatedCode.jsx} css={generatedCode.css} />
            </>
          ) : (
            <div className="lg:col-span-2 flex items-center justify-center text-center bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg">
              <div>
                <h2 className="text-2xl font-semibold text-slate-300">Your App Preview Will Appear Here</h2>
                <p className="text-slate-400 mt-1">Enter a description above and click "Generate App".</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;