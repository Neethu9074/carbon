/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ProgressIndicator, ProgressStep } from '@instana/carbon';
import { Tearsheet } from '@instana/ibm-products';
import { Typography } from '@instana/components';

import RoleSelector from 'in-plg/components/NoviceToPro/assets/RoleSelector.png';
import { StepOne } from 'in-plg/components/NoviceToPro/RoleSelector/StepOne';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-plg/components/NoviceToPro/FreetrialRoleSelector.mless';

interface FreetrialRoleSelectorProps {
  selectedRole: string | null;
  setSelectedRole: (role: string | null) => void;
  customRole: string;
  setCustomRole: (role: string) => void;
  handleSubmit: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

export default function FreetrialRoleSelector({
  selectedRole,
  setSelectedRole,
  customRole,
  setCustomRole,
  handleSubmit,
  currentStep,
  setCurrentStep,
  checked,
  setChecked
}: FreetrialRoleSelectorProps) {
  const username = user?.fullName;
  const headerTitle = t('in-plg:trialNoviceToProDialog.welcometitle', { username });
  const steps = [t('in-plg:trialNoviceToProDialog.steps.stepOne'), t('in-plg:trialNoviceToProDialog.steps.stepTwo')];

  const handleNext = () => {
    if (selectedRole) {
      handleSubmit();
    }
  };

  const isNextDisabled = !selectedRole || (selectedRole === 'other' && customRole.trim() === '');

  return (
    //@ts-expect-error: Suppressing this error as the `children` prop is unsupported in the type definitions.
    <Tearsheet
      className={locals.fullScreenModal}
      open
      hasCloseIcon={false}
      actions={
        currentStep === 0
          ? [
              {
                kind: 'primary',
                label: t('in-plg:trialNoviceToProDialog.next'),
                onClick: handleNext,
                disabled: isNextDisabled
              }
            ]
          : []
      }
      selectorPrimaryFocus="#freetrial-header-title"
      title={
        <>
          <Typography variant="heading-04">{headerTitle} </Typography>
          <ProgressIndicator
            className={locals.progressIndicator}
            currentIndex={currentStep}
            onChange={idx => setCurrentStep(idx)}
            id="freetrial-header-title"
            spaceEqually
          >
            {steps.map((step, index) => (
              <ProgressStep
                key={`step-${step}`}
                current={currentStep === index}
                complete={index < currentStep}
                index={index}
                disabled={index > currentStep}
                label={step}
              />
            ))}
          </ProgressIndicator>
        </>
      }
    >
      <div className={locals.roleSelector}>
        <div className={locals.stepOne}>
          <StepOne
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            customRole={customRole}
            setCustomRole={setCustomRole}
            checked={checked}
            setChecked={setChecked}
          />
        </div>
        <div className={locals.imageWrapper}>
          <img src={RoleSelector} alt="Visual" className={locals.image} />
        </div>
      </div>
    </Tearsheet>
  );
}
