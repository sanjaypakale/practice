import React, { useState } from "react";
import { Stepper, Step, StepLabel, StepContent, Button, Typography } from "@mui/material";

const steps = [
  "Choose your platform",
  "Choose your source",
  "Choose your pipeline"
];

const getStepContent = (step) => {
  switch (step) {
    case 0:
      return "Content for Choose your platform";
    case 1:
      return "Content for Choose your source";
    case 2:
      return "Content for Choose your pipeline";
    default:
      return "Unknown step";
  }
};

const VerticalStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState(new Set());

  const handleNext = () => {
    setVisitedSteps(new Set(visitedSteps.add(activeStep)));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      {steps.map((label, index) => (
        <Step key={label} expanded={visitedSteps.has(index) || activeStep === index}>
          <StepLabel>{label}</StepLabel>
          <StepContent>
            <Typography>{getStepContent(index)}</Typography>
            {activeStep === index && (
              <div>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            )}
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
};

export default VerticalStepper;
