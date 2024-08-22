/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Message, Stack, TextArea, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import { FeedbackStepConfigs } from 'in-events/components/feedback/eventStepConfig';
import { manuallyCloseEventEnabled } from 'in-services/featureFlags';
import { EVENT_TYPES, getEventType } from 'in-stores/events';
import { role } from 'in-stores/user';

import locals from 'in-events/components/feedback/Feedback.mless';

export default function FeedbackStepThree({ form, setForm, nextStep, eventData }: FeedbackStepConfigs) {
  const setValue = (form: MapForm<any>, path: string[], value: any) => {
    //@ts-expect-error error for typing
    setForm(form.updateIn(path, item => (item as Field<any>).setValue(value).setTouched(true)));
  };

  if (
    eventData?.get('state') === 'manually_closed' ||
    eventData?.get('state') === 'closed' ||
    !manuallyCloseEventEnabled ||
    !role?.canManuallyCloseIssue ||
    (eventData && getEventType(eventData) !== EVENT_TYPES.INCIDENT)
  ) {
    nextStep();
    return <></>;
  }

  return (
    <Stack direction="vertical" align="start" distribution="start">
      <div className={locals.inputContainer}>
        <Stack gap="xxsmall">
          <Typography variant="body-small">
            {t('in-events:closeEventDialog.comments')}
            <span style={{ color: 'red' }}>*</span>
          </Typography>

          <TextArea
            onChange={e => {
              if (e.target) {
                const target = e.target as HTMLTextAreaElement;
                setValue(form, ['closureComments'], target.value);
              }
            }}
            rows={10}
            placeholder={t('in-events:closeEventDialog.reasonForClosing')}
            className={locals.manualCloseTextInput}
          />
        </Stack>
      </div>
      <Message type="warning">{t('in-events:closeEventDialog.warningIncident')}</Message>
    </Stack>
  );
}
