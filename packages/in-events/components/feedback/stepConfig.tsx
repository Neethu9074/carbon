/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Align } from '@instana/components/types/components/Typography/types';

import problematic_end from 'in-events/components/feedback/assets/problematic_end.png';
import feedback_two from 'in-events/components/feedback/assets/feedback_two.png';
import FeedbackStepOne from 'in-events/components/feedback/FeedbackStepOne';
import FeedbackStepTwo from 'in-events/components/feedback/FeedbackStepTwo';
import { FeedbackConfigEventForm } from 'in-events/components/feedback/api';
import { t } from 'in-i18n';

export interface FeedbackStepConfigs {
  nextStep: () => void;
  form: MapForm<FeedbackConfigEventForm>;
  setForm: (form: MapForm<any>) => void;
}

interface StepConfig {
  title: string;
  titleAlignment: Align;
  description: string | string[];
  descriptionAlignment: Align;
  stepImg: string;
  component: (props: FeedbackStepConfigs) => JSX.Element;
  validateStep?: (form: MapForm<FeedbackConfigEventForm>) => boolean;
  hasFooter: boolean;
  isEnd: boolean;
  lastStep: boolean;
}

interface IStepConfig {
  [key: string]: StepConfig;
}

export const stepConfigs: IStepConfig = {
  start_0: {
    title: t('in-settings:maintenanceWindow.feedback.problematicStep0Title'),
    titleAlignment: 'left',
    description: [
      t('in-events:feedback.descriptionUnpleasant.firstLineApology'),
      t('in-events:feedback.descriptionUnpleasant.secondLineQuestion')
    ],
    descriptionAlignment: 'left',
    stepImg: feedback_two,
    component: ({ nextStep, form, setForm }: FeedbackStepConfigs) => (
      <FeedbackStepOne nextStep={nextStep} form={form} setForm={setForm} />
    ),
    validateStep: (form: MapForm<FeedbackConfigEventForm>) => {
      if (form && form.get('feedback') && !form.get('feedback').touched) return true;
      if (
        form && 
        form.get('feedback') && 
        form.get('feedback').touched && 
        form.get('feedback').value.length <= 0
      )
        return true;
      return false;
    },
    hasFooter: true,
    lastStep: false,
    isEnd: false
  },
  start_1: {
    title: t('in-events:feedback.appreciateResponse'),
    titleAlignment: 'left',
    description: t('in-events:feedback.followUpQuestion'),
    descriptionAlignment: 'left',
    stepImg: feedback_two,
    component: ({ nextStep, form, setForm }: FeedbackStepConfigs) => (
      <FeedbackStepTwo nextStep={nextStep} form={form} setForm={setForm} />
    ),
    validateStep: (form: MapForm<FeedbackConfigEventForm>) => {
      if (form && form.get('contactMe') && !form.get('contactMe').touched) return true;
      if (form && form.get('contactMe') && form.get('contactMe').touched && form.get('contactMe').value === undefined)
        return true;
      return false;
    },
    hasFooter: true,
    lastStep: true,
    isEnd: false
  },
  start_end: {
    title: t('in-settings:maintenanceWindow.feedback.problematicEndTitle'),
    titleAlignment: 'center',
    description: t('in-settings:maintenanceWindow.feedback.problematicEndDescription'),
    descriptionAlignment: 'center',
    stepImg: problematic_end,
    component: () => <></>,
    hasFooter: false,
    lastStep: true,
    isEnd: true
  }
};
