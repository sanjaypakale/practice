const App = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [repositoryFilled, setRepositoryFilled] = useState(false); // To track mandatory step

  const handleNext = () => {
    if (activeStep === 1 && !repositoryFilled) {
      alert('Please complete the Repository Details step.');
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCompleteRepository = () => {
    setRepositoryFilled(true);
  };

  const StepContent = () => {
    switch (activeStep) {
      case 0: return <GettingStarted />;
      case 1: return <RepositoryDetail />;
      case 2: return <BuildDetail />;
      case 3: return <SITPipeline />;
      case 4: return <AldonHashreportPipeline />;
      case 5: return <VeracodePipeline />;
      default: return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel icon={step.icon}>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        <StepContent />
        <div style={{ marginTop: '16px' }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === 1 ? (
            <Button
              variant="contained"
              onClick={() => {
                handleCompleteRepository();
                handleNext();
              }}
            >
              Complete & Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
