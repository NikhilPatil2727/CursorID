import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, value, onChange }) => {
  return (
    <div className="border border-gray-300 rounded-b-lg overflow-hidden">
      <Editor
        height="500px"
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollBeyondLastLine: false
        }}
      />
    </div>
  );
};

export default CodeEditor;