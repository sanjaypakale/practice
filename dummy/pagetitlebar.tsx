import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const PipelinePage = () => {
  return (
    <Box
      sx={{
        padding: '16px',
        backgroundColor: '#f9f9f9',
        height: '100vh',
      }}
    >
      {/* Title Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '2px solid #ddd',
          paddingBottom: '8px',
          marginBottom: '16px',
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', flexGrow: 1 }}
        >
          Pipeline
        </Typography>
        <Tooltip
          title={
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Tooltip Title
              </Typography>
              <Typography variant="body2">
                This is a custom HTML tooltip content. You can add more details here.
              </Typography>
            </Box>
          }
          arrow
          placement="top"
        >
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Content */}
      <Box>
        <Typography>
          Add the main content of your Pipeline page here.
        </Typography>
      </Box>
    </Box>
  );
};

export default PipelinePage;
