import React from 'react';

const PreviewPane = ({ code }) => {
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${code.css}</style>
      </head>
      <body>
        ${code.html}
        <script>${code.js}</script>
      </body>
    </html>
  `;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Live Preview</h3>
      <div className="border border-gray-300 rounded-lg overflow-hidden flex-grow">
        <iframe
          srcDoc={srcDoc}
          title="preview"
          sandbox="allow-scripts"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default PreviewPane;