/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { Stack, Checkbox } from '@instana/components';

import { FeedbackStepConfigs } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/stepConfig';
import FormTextArea from 'in-components/form/TextArea';
import { t } from 'in-i18n';

import locals from './Feedback.mless';

export default function FeedbackStepTwo({ form, setForm }: FeedbackStepConfigs) {
  const setValue = (form: MapForm<any>, path: string[], value: any) => {
    //@ts-expect-error-next-line
    setForm(form.updateIn(path, item => (item as Field<any>).setValue(value).setTouched(true)));
  };
  const [boxOne, setBoxOne] = useState<boolean>(false);
  const [boxTwo, setBoxTwo] = useState<boolean>(false);
  const [boxThree, setBoxThree] = useState<boolean>(false);

  return (
    <Stack direction="vertical" align="start" distribution="start">
      <Checkbox
        size="larger"
        onChange={() => setBoxOne(!boxOne)}
        label={t('in-settings:tabs.step1RMWTitle')}
        checked={boxOne}
      />
      {boxOne && (
        <FormTextArea
          className={locals.feedbackTextArea}
          placeholder={t('in-settings:maintenanceWindow.feedback.problematicInputStepholder')}
          onChange={e => {
            if (e.target) {
              const target = e.target as HTMLTextAreaElement;
              setValue(form, ['stepOne'], target.value);
            }
          }}
        />
      )}
      <Checkbox
        size="larger"
        onChange={() => setBoxTwo(!boxTwo)}
        label={t('in-settings:tabs.step2RMWTitle')}
        checked={boxTwo}
      />
      {boxTwo && (
        <FormTextArea
          className={locals.feedbackTextArea}
          placeholder={t('in-settings:maintenanceWindow.feedback.problematicInputStepholder')}
          onChange={e => {
            if (e.target) {
              const target = e.target as HTMLTextAreaElement;
              setValue(form, ['stepTwo'], target.value);
            }
          }}
        />
      )}
      <Checkbox
        size="larger"
        onChange={() => setBoxThree(!boxThree)}
        label={t('in-settings:tabs.step3RMWTitle')}
        checked={boxThree}
      />
      {boxThree && (
        <FormTextArea
          className={locals.feedbackTextArea}
          placeholder={t('in-settings:maintenanceWindow.feedback.problematicInputStepholder')}
          onChange={e => {
            if (e.target) {
              const target = e.target as HTMLTextAreaElement;
              setValue(form, ['stepThree'], target.value);
            }
          }}
        />
      )}
    </Stack>
  );
}
