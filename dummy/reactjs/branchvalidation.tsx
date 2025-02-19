import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

const BranchNameField = ({ value, onChange }: { value: string; onChange: (newValue: string) => void }) => {
  const [error, setError] = useState<string | null>(null);

  const validateBranchName = (inputValue: string) => {
    const branchName = inputValue.replace(/^feature\//, ''); // Remove feature/ to validate only user input

    const bitbucketBranchRegex = /^[a-zA-Z0-9][a-zA-Z0-9._/-]*[a-zA-Z0-9]$/;
    const consecutiveInvalidChars = /\/\/|--|\.\.|\.-|-\.|\/\./;

    if (!bitbucketBranchRegex.test(branchName) || consecutiveInvalidChars.test(branchName)) {
      setError('Invalid branch name. It should follow Bitbucket branch naming rules.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let userInput = event.target.value;

    // Ensure "feature/" prefix
    if (!userInput.startsWith('feature/')) {
      userInput = `feature/${userInput}`;
    }

    if (validateBranchName(userInput)) {
      onChange(userInput);
    }
  };

  return (
    <TextField
      label="Branch Name"
      variant="outlined"
      fullWidth
      value={value}
      onChange={handleInputChange}
      error={!!error}
      helperText={error || "Branch name must start with 'feature/' and follow Bitbucket naming rules."}
    />
  );
};

export default BranchNameField;
