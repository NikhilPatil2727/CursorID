import React from 'react';
import { FaDownload, FaSync } from 'react-icons/fa';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Controls = ({ code, onRegenerate }) => {
  const downloadCode = () => {
    const zip = new JSZip();
    zip.file("index.html", code.html);
    zip.file("styles.css", code.css);
    zip.file("script.js", code.js);
    
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "ai-website.zip");
    });
  };

  return (
    <div className="flex space-x-4 justify-center">
      <button 
        onClick={onRegenerate} 
        className="flex items-center bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-secondary transition-colors"
      >
        <FaSync className="mr-2" /> Re-generate
      </button>
      <button 
        onClick={downloadCode} 
        className="flex items-center bg-gray-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
      >
        <FaDownload className="mr-2" /> Download Code
      </button>
    </div>
  );
};

export default Controls;