import React, { useEffect, useRef } from 'react';
import SwaggerEditorBundle from 'swagger-editor/dist/swagger-editor-bundle';
import 'swagger-editor/dist/swagger-editor.css';

export const SwaggerEditorField = ({ onChange, rawErrors, rawData }) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Initialize SwaggerEditorBundle on the container
    editorRef.current = SwaggerEditorBundle({
      dom_id: '#swagger-editor',
      layout: 'StandaloneLayout',
    });

    // Load the initial spec if provided
    if (rawData) {
      editorRef.current.specActions.updateSpec(rawData);
    }

    // Subscribe to changes
    const handleSpecChange = () => {
      const spec = editorRef.current.getState().toJS().spec; // Get current spec
      onChange(spec); // Trigger the onChange callback
    };

    // Listen for editor changes
    editorRef.current.getStore().subscribe(handleSpecChange);

    // Cleanup when unmounting
    return () => {
      editorRef.current.getStore().unsubscribe(handleSpecChange);
    };
  }, [onChange, rawData]);

  return (
    <div>
      <div
        id="swagger-editor"
        ref={editorContainerRef}
        style={{
          border: rawErrors ? '1px solid red' : '1px solid #ccc',
          height: '500px',
          width: '100%',
        }}
      />
      {rawErrors && <p style={{ color: 'red' }}>Invalid OpenAPI Specification</p>}
    </div>
  );
};
