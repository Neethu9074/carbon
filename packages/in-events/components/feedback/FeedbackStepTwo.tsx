/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';
import { Field, MapForm } from 'formalistic';

import { Stack, RadioButton } from '@instana/components';
import { t } from '@instana/i18n-react';

import { FeedbackStepConfigs } from 'in-events/components/feedback/eventStepConfig';

export default function FeedbackStepOne({ form, setForm }: FeedbackStepConfigs) {
  const setValue = (form: MapForm<any>, path: string[], value: any) => {
    //@ts-expect-error error for typing
    setForm(form.updateIn(path, item => (item as Field<any>).setValue(value).setTouched(true)));
  };

  const [contactMe, setContactMe] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if ((form.get('contactMe') as Field<boolean | undefined>).value !== contactMe)
      setValue(form, ['contactMe'], contactMe);
    // eslint-disable-next-line
  }, [contactMe, form]);

  return (
    <Stack direction="vertical" align="start" distribution="start">
      <RadioButton
        size="larger"
        onChange={() => setContactMe(true)}
        label={t('in-events:feedback.contactMeYes')}
        checked={contactMe === true}
      />
      <RadioButton
        size="larger"
        onChange={() => setContactMe(false)}
        label={t('in-events:feedback.contactMeNo')}
        checked={contactMe === false}
      />
    </Stack>
  );
}
