import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { MoonLoader } from 'react-spinners';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('html');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/generate', { prompt });
      setHtmlCode(res.data.html);
      setCssCode(res.data.css);
      setJsCode(res.data.js);
      toast.success('Website generated successfully!');
    } catch (err) {
      toast.error('Error generating code');
    }
    setLoading(false);
  };

  const getPreviewSrc = () => `
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster position="bottom-right" />
      
      <nav className="p-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AI Web Studio
          </h1>
          <button 
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <MoonLoader size={20} color="white" />
            ) : (
              'Generate Website'
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {/* Left Column - Preview */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-2xl p-4 relative">
            <div className="device-frame">
              <iframe
                title="Live Preview"
                srcDoc={getPreviewSrc()}
                className="w-full h-[600px] md:h-[800px] rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Controls */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-2xl p-4">
            <textarea
              className="w-full bg-gray-900 rounded-lg p-4 text-gray-200 placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              placeholder="Describe your website idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="bg-gray-800 rounded-2xl">
            <div className="flex border-b border-gray-700">
              {['html', 'css', 'js'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 flex-1 text-center transition ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.toUpperCase()}
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
                  lineNumbers: 'off',
                  scrollbar: { vertical: 'hidden' },
                }}
              />
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                       py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition"
            onClick={() => {
              const blob = new Blob([getPreviewSrc()], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'website.html';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download Website
          </button>
        </div>
      </div>
    </div>
  );
}

const deviceFrameStyle = {
  device: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    width: '95%',
    height: '95%',
    border: '10px solid #2d2d2d',
    borderRadius: '25px',
    boxShadow: '0 0 0 2px #3a3a3a, 0 0 20px rgba(0,0,0,0.5)',
    transform: 'rotate(-1deg)',
  },
};

const DeviceFrame = ({ children }) => (
  <div className="relative w-full h-full">
    <div style={deviceFrameStyle.device} />
    {children}
  </div>
);