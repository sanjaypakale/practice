import React from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import { FieldValidation } from '@rjsf/utils';
import TextField from '@material-ui/core/TextField';

/*
  This is the actual component that will get rendered in the form
*/
export const OutlinedTextField = ({
  onChange,
  rawErrors,
  required,
  formData,
  fieldProps,
}: FieldExtensionComponentProps<string>) => {
  const { title, pattern } = fieldProps; // Extract title and pattern from fieldProps

  // Regex validation for the field
  const isValidPattern = pattern ? new RegExp(pattern).test(formData) : true;

  const hasError = rawErrors?.length > 0 || !isValidPattern;
  const errorMessage = hasError
    ? `Invalid format, must match pattern: ${pattern}`
    : '';

  return (
    <TextField
      label={title} // Set the label from the title property
      variant="outlined"
      required={required}
      error={hasError}
      helperText={hasError ? errorMessage : ' '}
      value={formData || ''}
      onChange={e => onChange(e.target.value)}
      fullWidth
    />
  );
};

/*
  This is a validation function that will run when the form is submitted.
  It ensures that the value matches the provided pattern in the YAML.
*/
export const validatePatternValidation = (
  value: string,
  validation: FieldValidation,
  pattern: string,
) => {
  if (pattern && !new RegExp(pattern).test(value)) {
    validation.addError(`Value must match pattern: ${pattern}`);
  }
};
