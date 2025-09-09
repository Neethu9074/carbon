/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Column, Grid, ProgressIndicator, ProgressStep, RadioTile, Row, Stack } from '@instana/carbon';
import { SvgIcon, Typography } from '@instana/components';
import { Tearsheet } from '@instana/ibm-products';

import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { trackEventRequest } from 'in-plg/components/DataConsumptionMessage/segment';
import { triggerSendLetsGoFreetrial } from 'in-plg/components/NoviceToPro/segment';
import Onboarding from 'in-plg/components/NoviceToPro/assets/Onboarding.png';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-plg/components/NoviceToPro/GetStartedFreetrial.mless';

interface AgentOtelTilesProps {
  value: string;
  label: string;
  id: string;
  description: string;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

interface GetStartedFreetrialProps {
  handleButtonClick: (data?: string) => void;
}

export const setSelectedOptionValue = (val: string | null) => {
  if (val) {
    localStorage.setItem('selectedOptionValue', val);
  } else {
    localStorage.removeItem('selectedOptionValue');
  }
};

export const getSelectedOptionValue = (): string | null => {
  return localStorage.getItem('selectedOptionValue');
};

export const clearSelectedOptionValue = () => {
  localStorage.removeItem('selectedOptionValue');
};

export default function GetStartedFreetrial({ handleButtonClick }: GetStartedFreetrialProps) {
  const username = user?.fullName;
  const headerTitle = t('in-plg:trialNoviceToProDialog.welcometitle', { username });
  const steps = [t('in-plg:trialNoviceToProDialog.steps.stepOne'), t('in-plg:trialNoviceToProDialog.steps.stepTwo')];
  const currentStep = 1;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const agentEnforcementSteps = [
    {
      id: 'deployAgent',
      value: 'deployAgent',
      data: { requiredProperty: 'deployAgent' },
      label: t('in-plg:agentEnforcement.deployAgent'),
      description: t('in-plg:agentEnforcement.agentTileDescription')
    },
    {
      id: 'openTelemetryCollector',
      value: 'openTelemetryCollector',
      data: { requiredProperty: 'openTelemetryCollector' },
      label: t('in-plg:agentEnforcement.openTelemetryCollector'),
      description: t('in-plg:agentEnforcement.openTelemetryCollectorTileDesciption')
    },
    {
      id: 'other',
      value: 'other',
      data: { requiredProperty: 'other' },
      label: t('in-plg:agentEnforcement.other'),
      description: t('in-plg:agentEnforcement.otherTileDescription')
    }
  ];

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
    setSelectedOptionValue(value);
  };

  const handleLetsGo = () => {
    const selectedStep = agentEnforcementSteps.find(step => step.value === selectedOption);

    if (selectedStep) {
      const requiredValue = selectedStep.data.requiredProperty;
      const dataToPass: trackEventRequest = {
        requiredProperty: requiredValue,
        additionalProperties: { stepId: selectedStep.id }
      };
      setSelectedOption(selectedOption);
      triggerSendLetsGoFreetrial(dataToPass);
      handleButtonClick(requiredValue);
    }
  };

  const AgentOtelTiles = ({
    value,
    label,
    id,
    description,
    selectedOption,
    setSelectedOption
  }: AgentOtelTilesProps) => {
    const isSelected = selectedOption == value;
    return (
      <RadioTile
        className={locals.radioTileSize}
        id={id}
        value={value}
        checked={isSelected}
        onChange={() => setSelectedOption(value)}
      >
        <div className={locals.tileContent}>
          <Stack orientation="vertical" gap={4}>
            <Typography variant="body-compact-01">{label}</Typography>
            <Typography variant="label-01">
              <span className={locals.text}>{description}</span>
            </Typography>
          </Stack>
          <SvgIcon type="lib_deploy" />
        </div>
      </RadioTile>
    );
  };

  return (
    //@ts-expect-error: Suppressing this error as the `children` prop is unsupported in the type definitions.
    <Tearsheet
      open
      className={locals.fullScreenModal}
      hasCloseIcon={false}
      actions={
        currentStep === 1
          ? [
              {
                kind: 'primary',
                label: t('in-plg:agentEnforcement.letsGo'),
                onClick: handleLetsGo
              }
            ]
          : []
      }
      selectorPrimaryFocus="#freetrial-header-title"
      title={
        <>
          <Typography variant="heading-04">{headerTitle} </Typography>
          <ProgressIndicator className={locals.progressIndicator} currentIndex={currentStep} spaceEqually>
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
          <LeftRightPadding>
            <Stack gap={6} orientation="vertical">
              <Stack className={locals.spacing} gap={6} orientation="vertical">
                <Typography variant="heading-03">{t('in-plg:agentEnforcement.howToSetUpInstana')}</Typography>
              </Stack>
              <Row>
                <Grid fullWidth condensed className={locals.grid}>
                  {agentEnforcementSteps.map(option => (
                    <Column key={option.id} lg={5} md={5} sm={5}>
                      <AgentOtelTiles
                        value={option.value}
                        id={option.id}
                        label={option.label}
                        description={option.description}
                        selectedOption={selectedOption}
                        setSelectedOption={handleSelectOption}
                      />
                    </Column>
                  ))}
                </Grid>
              </Row>
            </Stack>
          </LeftRightPadding>
        </div>
        <div className={locals.imageWrapper}>
          <img src={Onboarding} alt="Visual" className={locals.image} />
        </div>
      </div>
    </Tearsheet>
  );
}
