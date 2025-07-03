import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const AIWebsiteBuilder = () => {
  const [prompt, setPrompt] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isCopied, setIsCopied] = useState({ html: false, css: false, js: false });
  const previewRef = useRef(null);
  
  // Sample templates for initial state
  const sampleHTML = `<!DOCTYPE html>
<html>
<head>
  <title>Your Website</title>
</head>
<body>
  <header>
    <h1>Welcome to My AI-Generated Website</h1>
  </header>
  <main>
    <section>
      <h2>About Us</h2>
      <p>This website was created with the power of AI!</p>
    </section>
  </main>
  <footer>
    <p>© 2023 AI Website Builder</p>
  </footer>
</body>
</html>`;

  const sampleCSS = `body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  padding: 2rem;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h2 {
  color: #6e8efb;
  margin-bottom: 1rem;
}

section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
}

footer {
  text-align: center;
  padding: 2rem;
  color: #777;
}`;

  const sampleJS = `// JavaScript will appear here
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded successfully!');
  
  // Example interactive feature
  const header = document.querySelector('header');
  header.addEventListener('click', function() {
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 200);
  });
});`;

  // Initialize with sample code
  useEffect(() => {
    setHtmlCode(sampleHTML);
    setCssCode(sampleCSS);
    setJsCode(sampleJS);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a website description');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would use:
      // const res = await axios.post('http://localhost:5000/generate', { prompt });
      // setHtmlCode(res.data.html);
      // setCssCode(res.data.css);
      // setJsCode(res.data.js);
      
      // For demo purposes, we'll just use sample code
      setHtmlCode(sampleHTML);
      setCssCode(sampleCSS);
      setJsCode(sampleJS);
      setIsGenerated(true);
    } catch (err) {
      alert('Error generating code: ' + err.message);
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

  const handleDownload = () => {
    const blob = new Blob([
      `<html><head><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}</script></body></html>`
    ], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-generated-site.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (type) => {
    let text = '';
    switch (type) {
      case 'html': text = htmlCode; break;
      case 'css': text = cssCode; break;
      case 'js': text = jsCode; break;
      default: return;
    }
    
    navigator.clipboard.writeText(text);
    setIsCopied({ ...isCopied, [type]: true });
    setTimeout(() => setIsCopied({ ...isCopied, [type]: false }), 2000);
  };

  const handleRegenerate = () => {
    setPrompt('');
    setIsGenerated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Website Builder
            </h1>
          </div>
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Website
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Input Section */}
        <section className="mb-12 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Describe Your Website
            </h2>
            <p className="text-gray-600 mb-4">Tell our AI what kind of website you want to create. Be as specific as possible for the best results.</p>
            
            <div className="relative">
              <textarea
                className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 h-32"
                placeholder="Example: A personal portfolio website with dark mode, a projects section, and a contact form..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 flex items-center">
                <span className="text-gray-500 text-sm mr-3">{prompt.length}/500</span>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 shadow-md flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Website
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {isGenerated && (
          <section className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-300 ${
                    activeTab === 'preview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('preview')}
                >
                  <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Live Preview
                  </div>
                </button>
                <button
                  className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-300 ${
                    activeTab === 'code'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('code')}
                >
                  <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Code Editor
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'preview' ? (
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Live Preview</h3>
                    <button 
                      onClick={handleRegenerate}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </button>
                  </div>
                  <div className="border rounded-lg overflow-hidden shadow-inner bg-gray-50">
                    <iframe
                      title="Live Preview"
                      srcDoc={getPreviewSrc()}
                      className="w-full h-[500px]"
                      ref={previewRef}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Edit Generated Code</h3>
                    <div className="flex space-x-3">
                      <button 
                        onClick={handleRegenerate}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Regenerate
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                        <span className="font-medium text-gray-700">HTML</span>
                        <button 
                          onClick={() => handleCopy('html')}
                          className="text-sm px-3 py-1 bg-white rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center"
                        >
                          {isCopied.html ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="h-64">
                        <Editor
                          height="100%"
                          defaultLanguage="html"
                          value={htmlCode}
                          onChange={(val) => setHtmlCode(val)}
                          theme="vs-light"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                        <span className="font-medium text-gray-700">CSS</span>
                        <button 
                          onClick={() => handleCopy('css')}
                          className="text-sm px-3 py-1 bg-white rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center"
                        >
                          {isCopied.css ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="h-64">
                        <Editor
                          height="100%"
                          defaultLanguage="css"
                          value={cssCode}
                          onChange={(val) => setCssCode(val)}
                          theme="vs-light"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                        <span className="font-medium text-gray-700">JavaScript</span>
                        <button 
                          onClick={() => handleCopy('js')}
                          className="text-sm px-3 py-1 bg-white rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center"
                        >
                          {isCopied.js ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="h-64">
                        <Editor
                          height="100%"
                          defaultLanguage="javascript"
                          value={jsCode}
                          onChange={(val) => setJsCode(val)}
                          theme="vs-light"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="py-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} AI Website Builder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AIWebsiteBuilder;