/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Message, Stack, Typography, Toggle, Tooltip, SvgIcon, CarbonTextInput } from '@instana/components';
import { t } from '@instana/i18n-react';

import { FeedbackStepConfigs } from 'in-events/components/feedback/eventStepConfig';
import { disableEventConfigEnabled } from 'in-services/featureFlags';
import { EVENT_TYPES, getEventType } from 'in-stores/events';
import { role } from 'in-stores/user';

import locals from 'in-events/components/feedback/Feedback.mless';

export default function FeedbackStepThree({ form, setForm, nextStep, eventData }: FeedbackStepConfigs) {
  const setValue = (form: MapForm<any>, path: string[], value: any) => {
    //@ts-expect-error error for typing
    setForm(form.updateIn(path, item => (item as Field<any>).setValue(value).setTouched(true)));
  };

  const canSuppressAlertAndDisableEvent = disableEventConfigEnabled && role?.canConfigureEventsAndAlerts;

  if (
    eventData?.get('state') === 'manually_closed' ||
    eventData?.get('state') === 'closed' ||
    !role?.canManuallyCloseIssue ||
    (eventData && getEventType(eventData) !== EVENT_TYPES.INCIDENT)
  ) {
    nextStep();
    return <></>;
  }

  return (
    <Stack direction="vertical" align="start" distribution="start">
      <div className={locals.inputContainer}>
        <CarbonTextInput
          id="comments"
          labelText={t('in-events:closeEventDialog.comments')}
          onChange={e => {
            if (e.target) {
              const target = e.target;
              setValue(form, ['closureComments'], target.value);
            }
          }}
          placeholder={t('in-events:closeEventDialog.reasonIncident')}
          className={locals.manualCloseTextInput}
        />
      </div>

      <Message type="warning">{t('in-events:closeEventDialog.warning')}</Message>

      {canSuppressAlertAndDisableEvent && (
        <Stack gap="xxsmall">
          <Stack direction="horizontal" gap="xxsmall" align="center">
            <Typography variant="body-small">{t('in-events:closeEventDialog.suppressAlerts')}</Typography>
            <Tooltip content={t('in-events:closeEventDialog.suppressAlertsIncidentTooltip')}>
              <SvgIcon type="lib_help_error_info_outline" size="xs" />
            </Tooltip>
          </Stack>

          <Toggle
            id="mute-alerts"
            name="mute-alerts"
            checked={form.get('muteAlerts').value}
            onToggle={checked => setValue(form, ['muteAlerts'], checked)}
            labelA={t('in-events:closeEventDialog.labelOff')}
            labelB={t('in-events:closeEventDialog.labelOn')}
          />

          <Stack direction="horizontal" gap="xxsmall" align="center">
            <Typography variant="body-small">{t('in-events:closeEventDialog.disableIncident')}</Typography>
            <Tooltip content={t('in-events:closeEventDialog.disableEventsTooltip')}>
              <SvgIcon type="lib_help_error_info_outline" size="xs" />
            </Tooltip>
          </Stack>

          <Toggle
            id="disable-event-config"
            name="disable-event-config"
            checked={form.get('disableEvent').value}
            onToggle={checked => setValue(form, ['disableEvent'], checked)}
            labelA={t('in-events:closeEventDialog.labelOff')}
            labelB={t('in-events:closeEventDialog.labelOn')}
          />
        </Stack>
      )}
    </Stack>
  );
}
