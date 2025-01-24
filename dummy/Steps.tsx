import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import { Check, GitHub, Build, Sync, Security, Settings } from '@mui/icons-material';

const steps = [
  { label: 'Getting started', icon: <Settings /> },
  { label: 'Repository Details', icon: <GitHub /> },
  { label: 'Build Details', icon: <Build /> },
  { label: 'SIT Pipeline', icon: <Sync /> },
  { label: 'Aldon & Hashreport Pipeline', icon: <Check /> },
  { label: 'Veracode Pipeline', icon: <Security /> },
];
