/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { ProgressIndicator, ProgressStep } from '@instana/carbon';
import { Tearsheet } from '@instana/ibm-products';

type Step = { title: string; component: JSX.Element };

interface AlertConfigTearSheetDialogProps {
  onClose: () => void;
  open: boolean;
  stepArray: Step[];
  isLoading?: boolean;
  handleSubmit: () => void;
  title: string;
  subtitle?: React.ReactNode;
  preventCloseOnClickOutside?: boolean;
}

export default function AlertConfigTearSheetDialog({
  onClose,
  open,
  stepArray,
  isLoading,
  handleSubmit,
  title,
  subtitle,
  preventCloseOnClickOutside
}: AlertConfigTearSheetDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const influencerContent = () => {
    const mapSteps = () => {
      const steps = stepArray.map((step: { title: string; component: React.ReactNode }, index: number) => (
        <ProgressStep
          key={`step-${index}`}
          current={currentStep === index}
          complete={testNext(index)}
          index={index}
          label={step.title}
        />
      ));

      return (
        <ProgressIndicator
          key="indicator"
          style={{ padding: '1.5rem' }}
          currentIndex={currentStep}
          onChange={idx => setCurrentStep(idx)}
          vertical
          spaceEqually
        >
          {steps}
        </ProgressIndicator>
      );
    };

    return mapSteps();
  };

  const testNext = (index: number) => {
    return index < currentStep;
  };

  const isLastStep = currentStep === stepArray.length - 1;

  const actionButtons = [
    {
      kind: 'primary' as const,
      label: isLastStep ? 'Submit' : 'Next',
      loading: false,
      disabled: isLoading,
      onClick: () => (isLastStep ? handleSubmit() : setCurrentStep(currentStep + 1))
    },
    {
      kind: 'secondary' as const,
      label: 'Back',
      onClick: () => {
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
        }
      },
      disabled: currentStep === 0 || isLoading
    },
    {
      kind: 'ghost' as const,
      label: 'Cancel',
      disabled: isLoading,
      onClick: () => onClose()
    }
  ];

  return (
    // @ts-expect-error -  Tearsheet component does support children but the types don't reflect it
    <Tearsheet
      closeIconDescription="Close the tearsheet"
      description={subtitle}
      influencer={influencerContent()}
      influencerPosition="left"
      influencerWidth="narrow"
      onClose={onClose}
      open={open}
      slug={0}
      title={title}
      actions={actionButtons}
      preventCloseOnClickOutside={preventCloseOnClickOutside}
      hasCloseIcon
    >
      {stepArray[currentStep].component}
    </Tearsheet>
  );
}

interface AlertStackedDialogProps {
  stackedLabel: string;
  stackedTitle: string;
  stackedDescription: string;
  open: boolean;
  preventCloseOnClickOutside?: boolean;
  onClose: () => void;
  content: React.ReactNode;
  handleSubmit: () => void;
}

export function AlertStackedDialog({
  stackedLabel,
  stackedTitle,
  stackedDescription,
  open,
  preventCloseOnClickOutside,
  onClose,
  content,
  handleSubmit
}: AlertStackedDialogProps) {
  const actionButtons = [
    {
      kind: 'primary' as const,
      label: 'Add',
      loading: false,
      onClick: () => handleSubmit()
    },
    {
      kind: 'secondary' as const,
      label: 'Cancel',
      onClick: () => onClose(),
      disabled: false
    }
  ];
  return (
    // @ts-expect-error -  Tearsheet component does support children but the types don't reflect it
    <Tearsheet
      label={stackedLabel}
      title={stackedTitle}
      description={stackedDescription}
      height="lower"
      preventCloseOnClickOutside={preventCloseOnClickOutside}
      open={open}
      actions={actionButtons}
      closeIconDescription="Close the tearsheet"
    >
      {content}
    </Tearsheet>
  );
}
