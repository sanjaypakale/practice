import React, { useState } from 'react';
import SwaggerEditor from 'swagger-editor';
import 'swagger-editor/dist/swagger-editor.css';

export const SwaggerEditorField = ({ onChange, rawErrors, rawData }) => {
  const [value, setValue] = useState(rawData || '');

  const handleEditorChange = (spec) => {
    setValue(spec);
    onChange(spec);
  };

  return (
    <div style={{ border: rawErrors ? '1px solid red' : 'none' }}>
      <SwaggerEditor
        spec={value}
        onChange={(editor) => handleEditorChange(editor.getValue())}
      />
      {rawErrors && <p style={{ color: 'red' }}>Invalid OpenAPI Specification</p>}
    </div>
  );
};
