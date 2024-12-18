import React, { useEffect, useRef } from 'react';
import SwaggerUI from 'swagger-editor/dist/swagger-editor-bundle';
import 'swagger-editor/dist/swagger-editor.css';

export const SwaggerEditorField = ({ onChange, rawErrors, rawData }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      // Initialize Swagger Editor
      const editor = SwaggerUI({
        dom_id: '#swagger-editor', // Target the container
        spec: rawData || '', // Initialize with existing spec if any
      });

      // Listen for changes and trigger the `onChange` callback
      editor.onDidChange(() => {
        const currentSpec = editor.getValue();
        onChange(currentSpec);
      });
    }
  }, [onChange, rawData]);

  return (
    <div>
      <div
        id="swagger-editor"
        ref={editorRef}
        style={{
          border: rawErrors ? '1px solid red' : 'none',
          height: '500px',
          width: '100%',
        }}
      />
      {rawErrors && <p style={{ color: 'red' }}>Invalid OpenAPI Specification</p>}
    </div>
  );
};
