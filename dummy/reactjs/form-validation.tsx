import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box, MenuItem, TextField, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

// A reusable TextField component that registers the input and displays a label using Typography.
// It shows an outlined info icon along with the error message when there's a validation error.
const FormTextField = ({ name, label, select = false, options = [], rules = {}, ...rest }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message;

  return (
    <Box my={2}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      <TextField
        {...register(name, rules)}
        select={select}
        fullWidth
        variant="outlined"
        error={!!errors[name]}
        helperText={
          errorMessage ? (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <InfoOutlinedIcon fontSize="small" style={{ marginRight: 4 }} />
              {errorMessage}
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
    </Box>
  );
};

const GettingStarted = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Welcome to DevOps Onboarding
      </Typography>
      <Typography variant="body1">
        Please follow the steps to complete your onboarding.
      </Typography>
    </Box>
  );
};

const RepositoryPicker = () => {
  return (
    <Box>
      <FormTextField
        name="bitbucketProject"
        label="Bitbucket Project"
        select
        rules={{ required: 'Project name is required' }}
        options={[
          { value: 'Project1', label: 'Project1' },
          { value: 'Project2', label: 'Project2' },
        ]}
      />
      <FormTextField
        name="bitbucketRepository"
        label="Bitbucket Repository"
        select
        rules={{ required: 'Repository name is required' }}
        options={[
          { value: 'Repo1', label: 'Repo1' },
          { value: 'Repo2', label: 'Repo2' },
        ]}
      />
    </Box>
  );
};

const BuildDetails = () => {
  return (
    <Box>
      <FormTextField
        name="buildCommand"
        label="Build Command"
        rules={{ required: 'Build command is required' }}
      />
      <FormTextField
        name="agentName"
        label="Agent Name"
        rules={{ required: 'Agent name is required' }}
      />
    </Box>
  );
};

const Review = () => {
  const { getValues } = useFormContext();
  const values = getValues();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Your Data
      </Typography>
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </Box>
  );
};

const steps = [
  'Getting Started',
  'Repository Picker',
  'Build Details',
  'Review',
];

const DevOpsOnboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm({ mode: 'onChange' });

  // Final form submission handler
  const onSubmit = (data) => {
    console.log('Form Submitted:', data);
    // Further processing, e.g., API calls, can go here
  };

  // Handle Next button click: validate current step; if final step, submit form.
  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      methods.handleSubmit(onSubmit)();
    } else {
      const isValid = await methods.trigger();
      if (isValid) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <GettingStarted />;
      case 1:
        return <RepositoryPicker />;
      case 2:
        return <BuildDetails />;
      case 3:
        return <Review />;
      default:
        return <div>Step {step + 1} Content</div>;
    }
  };

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>{getStepContent(activeStep)}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default DevOpsOnboarding;
