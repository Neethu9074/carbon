/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import rca_feedback_stan_one from 'in-events/components/feedback/assets/rca_feedback_stan_one.png';
import { FeedbackStepConfigs, IStepConfig } from 'in-events/components/feedback/eventStepConfig';
import rca_feedback_end from 'in-events/components/feedback/assets/rca_feedback_end.png';
import FeedbackStepOne from 'in-events/components/feedback/FeedbackStepOne';
import { FeedbackConfigEventForm } from 'in-events/components/feedback/api';
import { t } from 'in-i18n';

export const rcaStepConfig: IStepConfig = {
  start_0: {
    title: t('in-settings:maintenanceWindow.feedback.problematicStep0Title'),
    titleAlignment: 'left',
    description: t('in-events:feedback.rca.apology'),
    descriptionAlignment: 'left',
    stepImg: rca_feedback_stan_one,
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
    lastStep: () => true,
    isEnd: false,
    canSkip: false
  },
  start_end: {
    title: t('in-settings:maintenanceWindow.feedback.problematicEndTitle'),
    titleAlignment: 'center',
    description: t('in-settings:maintenanceWindow.feedback.problematicEndDescription'),
    descriptionAlignment: 'center',
    stepImg: rca_feedback_end,
    component: () => <></>,
    hasFooter: false,
    lastStep: () => true,
    isEnd: true,
    canSkip: false
  }
};
