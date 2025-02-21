import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box, MenuItem, TextField } from '@mui/material';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';

const steps = [
  'Getting Started',
  'Repository Picker',
  'Build Details',
  'Review',
];

const GettingStarted = () => {
  // Placeholder for getting started content
  return (
    <Box>
      <h2>Welcome to DevOps Onboarding</h2>
      <p>Please follow the steps to complete your onboarding.</p>
    </Box>
  );
};

const RepositoryPicker = () => {
  // Use useFormContext() to connect with the parent form state
  const { control, formState: { errors } } = useFormContext();

  return (
    <Box>
      <Controller
        name="bitbucketProject"
        control={control}
        rules={{ required: 'Project name is required' }}
        render={({ field }) => (
          <TextField 
            {...field} 
            select 
            label="Bitbucket Project" 
            fullWidth 
            error={!!errors.bitbucketProject} 
            helperText={errors.bitbucketProject?.message}
          >
            <MenuItem value="Project1">Project1</MenuItem>
            <MenuItem value="Project2">Project2</MenuItem>
          </TextField>
        )}
      />
      <Controller
        name="bitbucketRepository"
        control={control}
        rules={{ required: 'Repository name is required' }}
        render={({ field }) => (
          <TextField 
            {...field} 
            select 
            label="Bitbucket Repository" 
            fullWidth 
            error={!!errors.bitbucketRepository} 
            helperText={errors.bitbucketRepository?.message}
          >
            <MenuItem value="Repo1">Repo1</MenuItem>
            <MenuItem value="Repo2">Repo2</MenuItem>
          </TextField>
        )}
      />
    </Box>
  );
};

const BuildDetails = () => {
  // Use useFormContext() to share the parent form state
  const { control, formState: { errors } } = useFormContext();

  return (
    <Box>
      <Controller
        name="buildCommand"
        control={control}
        rules={{ required: 'Build command is required' }}
        render={({ field }) => (
          <TextField 
            {...field} 
            label="Build Command" 
            fullWidth 
            error={!!errors.buildCommand} 
            helperText={errors.buildCommand?.message} 
          />
        )}
      />
      <Controller
        name="agentName"
        control={control}
        rules={{ required: 'Agent name is required' }}
        render={({ field }) => (
          <TextField 
            {...field} 
            label="Agent Name" 
            fullWidth 
            error={!!errors.agentName} 
            helperText={errors.agentName?.message} 
          />
        )}
      />
    </Box>
  );
};

const Review = () => {
  const { getValues } = useFormContext();
  const values = getValues();

  return (
    <Box>
      <h3>Review Your Data</h3>
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </Box>
  );
};

const DevOpsOnboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm({ mode: 'onChange' });

  // Final form submission function
  const onSubmit = (data) => {
    console.log('Form Submitted:', data);
    // Here you can handle the form data further (e.g., send to an API)
  };

  // Handle Next button click: validate current step and move forward.
  // If on the final step, trigger form submission.
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
        <Box sx={{ mt: 3 }}>
          {getStepContent(activeStep)}
        </Box>
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
