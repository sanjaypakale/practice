import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';

const BranchNameField = (props: FieldExtensionComponentProps<string>) => {
  const { onChange, rawErrors = [], formData } = props;
  const [value, setValue] = useState<string>(formData || 'feature/');

  // Function to validate the branch name based on Bitbucket's rules
  const validateBranchName = (branchName: string): string | null => {
    const sanitizedBranchName = branchName.replace(/^feature\//, ''); // Remove 'feature/' for validation

    // Bitbucket branch naming rules
    const bitbucketBranchRegex = /^[a-zA-Z0-9][a-zA-Z0-9._/-]*[a-zA-Z0-9]$/;
    const consecutiveInvalidChars = /\/\/|--|\.\.|\.-|-\.|\/\./;

    if (!bitbucketBranchRegex.test(sanitizedBranchName) || consecutiveInvalidChars.test(sanitizedBranchName)) {
      return 'Invalid branch name. Follow Bitbucket naming rules.';
    }
    return null;
  };

  useEffect(() => {
    const errorMessage = validateBranchName(value);
    if (!errorMessage) {
      onChange(value); // Update Backstage form if valid
    }
  }, [value, onChange]); // Trigger validation when value changes

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let userInput = event.target.value;

    // Ensure "feature/" prefix
    if (!userInput.startsWith('feature/')) {
      userInput = `feature/${userInput}`;
    }

    setValue(userInput);
  };

  return (
    <TextField
      label="Branch Name"
      variant="outlined"
      fullWidth
      value={value}
      onChange={handleInputChange}
      error={!!validateBranchName(value) || rawErrors.length > 0}
      helperText={validateBranchName(value) || rawErrors.join(', ') || "Branch name must start with 'feature/' and follow Bitbucket naming rules."}
    />
  );
};

export default BranchNameField;
