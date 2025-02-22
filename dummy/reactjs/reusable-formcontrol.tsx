import React from 'react';
import { Box, MenuItem, TextField, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useFormContext, Controller } from 'react-hook-form';

const FormTextField = ({ name, label, select = false, options = [], rules = {}, ...rest }) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Box my={2}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <TextField
            {...field}
            select={select}
            fullWidth
            variant="outlined"
            error={!!errors[name]}
            helperText={
              errors[name]?.message ? (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <InfoOutlinedIcon fontSize="small" style={{ marginRight: 4 }} />
                  {errors[name]?.message}
                </span>
              ) : ''
            }
            {...rest}
          >
            {select &&
              options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
        )}
      />
    </Box>
  );
};

export default FormTextField;
