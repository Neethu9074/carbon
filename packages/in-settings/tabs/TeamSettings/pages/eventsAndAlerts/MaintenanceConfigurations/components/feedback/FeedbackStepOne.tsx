/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Button, Stack } from '@instana/components';

import { FeedbackStepConfigs } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/stepConfig';
import terrible from './assets/terrible.png';
import awesome from './assets/awesome.png';
import meh from './assets/meh.png';
import { t } from 'in-i18n';

import locals from './Feedback.mless';

export default function FeedbackStepOne({ nextStep, form, setForm }: FeedbackStepConfigs) {
  const setValue = (form: MapForm<any>, path: string[], value: any) => {
    //@ts-ignore-next-line
    setForm(form.updateIn(path, item => (item as Field<any>).setValue(value).setTouched(true)));
  };
  return (
    <Stack direction="horizontal" align="center" distribution="center">
      <Button
        kind="subtle"
        className={locals.feedbackButton}
        size="xl"
        type="submit"
        onClick={() => {
          setValue(form, ['feeling'], 'AWESOME');
          nextStep('happy_end');
        }}
      >
        <Stack direction="horizontal" align="center" distribution="center" gap="xsmall">
          <img src={awesome} className={locals.feedbackButtomImg} />
          {t('in-settings:maintenanceWindow.feedback.awesome')}
        </Stack>
      </Button>
      <Button
        kind="subtle"
        className={locals.feedbackButton}
        size="xl"
        onClick={() => {
          setValue(form, ['feeling'], 'MEH');
          nextStep('problematic_0');
        }}
      >
        <Stack direction="horizontal" align="center" distribution="center" gap="xsmall">
          <img src={meh} className={locals.feedbackButtomImg} />
          {t('in-settings:maintenanceWindow.feedback.meh')}
        </Stack>
      </Button>
      <Button
        kind="subtle"
        className={locals.feedbackButton}
        size="xl"
        onClick={() => {
          setValue(form, ['feeling'], 'TERRIBLE');
          nextStep('problematic_0');
        }}
      >
        <Stack direction="horizontal" align="center" distribution="center" gap="xsmall">
          <img src={terrible} className={locals.feedbackButtomImg} />
          {t('in-settings:maintenanceWindow.feedback.terrible')}
        </Stack>
      </Button>
    </Stack>
  );
}
