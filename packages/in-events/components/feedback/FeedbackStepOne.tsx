/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { FeedbackStepConfigs } from 'in-events/components/feedback/eventStepConfig';
import FormTextArea from 'in-components/form/TextArea';
import { t } from 'in-i18n';

import locals from './Feedback.mless';

export default function FeedbackStepOne({ form, setForm }: FeedbackStepConfigs) {
  const setValue = (form: MapForm<any>, path: string[], value: any) => {
    //@ts-expect-error-next-line
    setForm(form.updateIn(path, item => (item as Field<any>).setValue(value).setTouched(true)));
  };

  return (
    <FormTextArea
      className={locals.feedbackTextArea}
      placeholder={t('in-events:feedback.pleaseDescribeWhatWentWrongTextBox')}
      onChange={e => {
        if (e.target) {
          const target = e.target as HTMLTextAreaElement;
          setValue(form, ['feedback'], target.value);
        }
      }}
    />
  );
}
