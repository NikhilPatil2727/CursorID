// BuilderPage.js
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BuilderPage = () => {
  const [prompt, setPrompt] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const [previewKey, setPreviewKey] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/generate', { prompt });
      setHtmlCode(res.data.html || '');
      setCssCode(res.data.css || '');
      setJsCode(res.data.js || '');
      setPreviewKey(prev => prev + 1);
    } catch (err) {
      alert('Error generating code');
    }
    setLoading(false);
  };

  const getPreviewSrc = () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}</script>
      </body>
    </html>
  `;

  useEffect(() => {
    if (htmlCode || cssCode || jsCode) {
      const timer = setTimeout(() => {
        document.querySelector('.preview-refresh')?.classList.add('animate-ping-once');
        setTimeout(() => {
          document.querySelector('.preview-refresh')?.classList.remove('animate-ping-once');
        }, 500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [htmlCode, cssCode, jsCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gray-900/80 border-b border-gray-700">
            <h2 className="text-xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
              </svg>
              Fullscreen Preview
            </h2>
            <button 
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
              onClick={() => setShowFullscreen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <iframe
            title="Fullscreen Preview"
            srcDoc={getPreviewSrc()}
            className="w-full h-full"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      )}

      <header className="sticky top-0 z-40 backdrop-blur-md bg-gray-900/80 border-b border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                  <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                AI Web Studio
              </h1>
            </Link>
            
            <button 
              className={`px-6 py-3 rounded-xl shadow-lg font-medium flex items-center space-x-2 transition-all duration-300 transform hover:scale-105
                ${loading 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <span>Generate Website</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-1 shadow-2xl">
              <div className="bg-gray-900/50 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                    </svg>
                    Live Preview
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>
                
                <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-xl h-[500px] md:h-[700px]">
                  {htmlCode || cssCode || jsCode ? (
                    <iframe
                      key={previewKey}
                      title="Live Preview"
                      srcDoc={getPreviewSrc()}
                      className="w-full h-full rounded-lg relative z-10"
                      sandbox="allow-same-origin allow-scripts"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-0">
                      <div className="text-center">
                        <div className="bg-gray-800/50 rounded-full p-6 inline-block mb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-300 mb-2">Preview Unavailable</h3>
                        <p className="text-gray-500 max-w-md">
                          Generate a website to see the live preview here
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
                    <button 
                      className="preview-refresh bg-gray-800/80 backdrop-blur-sm p-2 rounded-full hover:bg-gray-700 transition-all"
                      onClick={() => setPreviewKey(prev => prev + 1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <button 
                      className="bg-gray-800/80 backdrop-blur-sm p-2 rounded-full hover:bg-gray-700 transition-all"
                      onClick={() => setShowFullscreen(true)}
                      disabled={!htmlCode && !cssCode && !jsCode}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 9a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v1.586l1.293-1.293a1 1 0 111.414 1.414L16.414 15H15a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-1.293-1.293a1 1 0 111.414-1.414l1.293 1.293V13a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent pointer-events-none z-10"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-1 shadow-xl">
              <div className="bg-gray-900/50 rounded-xl p-5 h-full">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Describe Your Website
                </h2>
                <textarea
                  className="w-full bg-gray-800/50 rounded-xl p-4 text-gray-200 placeholder-gray-500 
                            focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all
                            border border-gray-700 hover:border-gray-600 min-h-[120px]"
                  placeholder="Example: 'Create a responsive landing page for a tech startup with a dark theme...'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                />
                <div className="mt-3 text-sm text-gray-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Be as descriptive as possible for better results
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-1 shadow-xl overflow-hidden">
              <div className="bg-gray-900/50 rounded-xl h-full">
                <div className="flex border-b border-gray-700">
                  {['html', 'css', 'js'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-6 py-4 flex-1 text-center transition-all duration-300 relative group
                        ${activeTab === tab
                          ? 'text-white'
                          : 'text-gray-400 hover:text-gray-200'
                        }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.toUpperCase()}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 ${activeTab === tab ? 'scale-x-100' : ''}`}></span>
                    </button>
                  ))}
                </div>
                
                <div className="p-4 h-[400px]">
                  <Editor
                    language={activeTab}
                    value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
                    onChange={(val) => {
                      if (activeTab === 'html') setHtmlCode(val);
                      if (activeTab === 'css') setCssCode(val);
                      if (activeTab === 'js') setJsCode(val);
                    }}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      readOnly: loading
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 py-3 rounded-xl shadow-lg 
                  font-medium flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.02] 
                  border border-gray-600 hover:border-gray-500"
                onClick={() => {
                  setHtmlCode('');
                  setCssCode('');
                  setJsCode('');
                  setPrompt('');
                  setPreviewKey(prev => prev + 1);
                }}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Reset All</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .animate-ping-once {
          animation: ping 0.5s cubic-bezier(0,0,0.2,1);
        }
        
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BuilderPage;