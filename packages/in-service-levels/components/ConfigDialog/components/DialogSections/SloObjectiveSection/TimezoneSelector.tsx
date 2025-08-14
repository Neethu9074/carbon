/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { InlineNotification, Stack, Toggle } from '@instana/carbon';
import { ValidationBlock } from '@instana/components';

import TimezoneList from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/TimezoneList';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { getCurrentFormattedTimezone } from 'in-service-levels/utils/timezone';
import { isFieldValid } from 'in-service-levels/utils/form';
import { t } from 'in-i18n';

import locals from './TimezoneSelector.mless';

export default function TimezoneSelector() {
  const { form, onChange } = useContext(SloFormContext);
  const timezoneForm = form.getIn(['objective', 'timezone']);
  const bindField = form.getIn(['objective', 'timezone', 'bind']);
  const zoneField = form.getIn(['objective', 'timezone', 'zone']);
  const isTimezoneFormValid = isFieldValid(timezoneForm);

  const isTimezoneDifferent = zoneField.value !== getCurrentFormattedTimezone();
  const showTimezoneNotification = bindField.value && zoneField.value && isTimezoneDifferent;
  const timezoneMessage = t('in-service-levels:createSloDialog.currentTimezoneMessage', {
    timezone: getCurrentFormattedTimezone()
  });

  const handleTimezoneToggle = (toggleValue: boolean) => {
    if (!toggleValue) {
      onChange(['objective', 'timezone', 'zone'], () => zoneField.setValue(''));
    }
    onChange(['objective', 'timezone', 'bind'], () => bindField.setValue(toggleValue));
  };

  return (
    <Stack orientation="vertical" gap={4}>
      <Toggle
        className={locals.toggleContainer}
        id="slo-objective-timezone-toggle"
        value={
          bindField.value
            ? t('in-service-levels:createSloDialog.enabledToggleLabel')
            : t('in-service-levels:createSloDialog.disabledToggleLabel')
        }
        labelText={t('in-service-levels:createSloDialog.bindTimezoneLabel')}
        labelA={t('in-service-levels:createSloDialog.enabledToggleLabel')}
        labelB={t('in-service-levels:createSloDialog.disabledToggleLabel')}
        size="sm"
        onToggle={handleTimezoneToggle}
        toggled={bindField.value}
      />
      <TimezoneList />
      {!isTimezoneFormValid &&
        timezoneForm.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
      {showTimezoneNotification && (
        <InlineNotification
          className={locals.notificationContainer}
          id="timezone-toast-notification"
          kind="info"
          hideCloseButton
          lowContrast
          subtitle={timezoneMessage}
        />
      )}
    </Stack>
  );
}
