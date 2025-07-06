import React, { useMemo } from 'react';

const CodePreview = ({ jsx, css }) => {
  const srcDoc = useMemo(() => {
    if (!jsx) return '';

    return `
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            /* Simple CSS Reset and Global Styles */
            html, body, #root {
              height: 100%;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            *, *::before, *::after {
              box-sizing: inherit;
            }
            /* Custom CSS from AI */
            ${css}
          </style>
          
          <!-- ✅ FIX 1: Load React & ReactDOM first in head -->
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
         <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          
          <!-- ✅ FIX 2: Load Babel after React dependencies -->
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          
          <script type="text/babel">
            try {
              ${jsx}
              
              const container = document.getElementById('root');
              
              // ✅ FIX 3: Add fallback for ReactDOM availability
              if (!window.ReactDOM) {
                throw new Error("React DOM failed to load. Check CDN availability.");
              }
              
              const root = ReactDOM.createRoot(container);
              root.render(<App />);

            } catch (err) {
              const rootEl = document.getElementById('root');
              const errorHTML = \`<div style="color: red; font-family: sans-serif; padding: 1rem;">
                <h1>Render Error</h1>
                <pre>\${err.message}</pre>
                <p>Check console for details</p>
              </div>\`;
              rootEl.innerHTML = errorHTML;
              console.error("Live Preview Error:", err);
            }
          </script>
        </body>
      </html>
    `;
  }, [jsx, css]);

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg">
      <iframe
        srcDoc={srcDoc}
        title="Live Preview"
        sandbox="allow-scripts allow-modals allow-same-origin"
        width="100%"
        height="100%"
        className="border-0"
      />
    </div>
  );
};

export default CodePreview;