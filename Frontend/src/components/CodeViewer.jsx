// src/components/CodeViewer.jsx

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeViewer = ({ jsx, css }) => {
  const [activeTab, setActiveTab] = useState('jsx');

  return (
    <div className="w-full h-full bg-slate-800 rounded-lg shadow-lg flex flex-col">
      <div className="flex-shrink-0 border-b border-slate-600">
        <button
          onClick={() => setActiveTab('jsx')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'jsx' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
        >
          App.jsx
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'css' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
        >
          style.css
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        <SyntaxHighlighter
          language={activeTab === 'jsx' ? 'jsx' : 'css'}
          style={atomDark}
          customStyle={{ margin: 0, height: '100%', backgroundColor: 'transparent' }}
          showLineNumbers
        >
          {activeTab === 'jsx' ? jsx : css}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeViewer;