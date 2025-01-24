import React, { useState } from "react";
import { TextField, Tooltip, Box, Typography, IconButton, styled } from "@mui/material";
import InfoIcon from "@material-ui/icons/Info";

// Custom styled TextField with default styles
const StyledTextField = styled(TextField)(({ theme, error }: { theme: any; error?: boolean }) => ({
  "& .MuiOutlinedInput-root": {
    borderColor: error ? theme.palette.error.main : "#ADD8E6",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "4px",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: error ? theme.palette.error.main : "#ADD8E6",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: error ? theme.palette.error.main : "#ADD8E6",
  },
  marginBottom: theme.spacing(2), // Added bottom spacing on TextField
}));

// Type definition for TextInput props
interface TextInputProps {
  label: string;
  helperText?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  size?: "small" | "medium"; // Added size prop type
  [key: string]: any; // For additional props like 'type', 'disabled', etc.
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  helperText = "",
  value: initialValue = "",
  onChange,
  error = false,
  errorMessage = "",
  size = "small", // Default size is small
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box display="flex" alignItems="center" mb={0.5}>
        <Typography variant="body1" component="label" style={{ marginRight: "8px" }}>
          {label}
        </Typography>
        {helperText && (
          <Tooltip title={helperText} arrow>
            <IconButton size="small">
              <InfoIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <StyledTextField
        size={size} // Use size prop
        value={value}
        onChange={handleChange}
        error={!!error}
        helperText={error ? errorMessage : ""}
        {...props}
      />
    </Box>
  );
};

export default TextInput;
