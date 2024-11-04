/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Align } from '@instana/components/types/components/Typography/types';

import feedback_stan_one from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/assets/feedback_stan_one.png';
import problematic_end from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/assets/problematic_end.png';
import feedback_two from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/assets/feedback_two.png';
import awesome_end from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/assets/awesome_end.png';
import FeedbackStepOne from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/FeedbackStepOne';
import FeedbackStepTwo from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/FeedbackStepTwo';
import { FeedbackConfigRMWForm } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/api';
import { t } from 'in-i18n';

export interface FeedbackStepConfigs {
  nextStep(stepKey: string): void;
  form: MapForm<FeedbackConfigRMWForm>;
  setForm: (form: MapForm<any>) => void;
}

interface StepConfig {
  title: string;
  titleAlignment: Align;
  description: string;
  descriptionAlignment: Align;
  stepImg: string;
  component: (props: FeedbackStepConfigs) => JSX.Element;
  hasFooter: boolean;
  isEnd: boolean;
  lastStep: boolean;
}

interface IStepConfig {
  [key: string]: StepConfig;
}

export const stepConfigs: IStepConfig = {
  start_0: {
    title: t('in-settings:maintenanceWindow.feedback.rateYourExperience'),
    titleAlignment: 'center',
    description: t('in-settings:maintenanceWindow.feedback.satisfiedQuestion'),
    descriptionAlignment: 'center',
    stepImg: feedback_stan_one,
    component: ({ nextStep, form, setForm }: FeedbackStepConfigs): JSX.Element => (
      <FeedbackStepOne nextStep={nextStep} form={form} setForm={setForm} />
    ),
    hasFooter: false,
    lastStep: false,
    isEnd: false
  },
  firstTimeStart_0: {
    title: t('in-settings:maintenanceWindow.feedback.rateYourExperience'),
    titleAlignment: 'center',
    description: t('in-settings:maintenanceWindow.feedback.firstTimeSatisfiedQuestion'),
    descriptionAlignment: 'center',
    stepImg: feedback_stan_one,
    component: ({ nextStep, form, setForm }: FeedbackStepConfigs): JSX.Element => (
      <FeedbackStepOne nextStep={nextStep} form={form} setForm={setForm} />
    ),
    hasFooter: false,
    lastStep: false,
    isEnd: false
  },
  problematic_0: {
    title: t('in-settings:maintenanceWindow.feedback.problematicStep0Title'),
    titleAlignment: 'center',
    description: t('in-settings:maintenanceWindow.feedback.problematicStep0Description'),
    descriptionAlignment: 'center',
    stepImg: feedback_two,
    component: ({ nextStep, form, setForm }: FeedbackStepConfigs) => (
      <FeedbackStepTwo nextStep={nextStep} form={form} setForm={setForm} />
    ),
    hasFooter: true,
    lastStep: true,
    isEnd: false
  },
  problematic_end: {
    title: t('in-settings:maintenanceWindow.feedback.problematicEndTitle'),
    titleAlignment: 'center',
    description: t('in-settings:maintenanceWindow.feedback.problematicEndDescription'),
    descriptionAlignment: 'center',
    stepImg: problematic_end,
    component: () => <></>,
    hasFooter: false,
    lastStep: true,
    isEnd: true
  },
  happy_end: {
    title: t('in-settings:maintenanceWindow.feedback.happyEndTitle'),
    titleAlignment: 'center',
    description: t('in-settings:maintenanceWindow.feedback.happyEndDescription'),
    descriptionAlignment: 'center',
    stepImg: awesome_end,
    component: () => <></>,
    hasFooter: false,
    lastStep: true,
    isEnd: true
  }
};
