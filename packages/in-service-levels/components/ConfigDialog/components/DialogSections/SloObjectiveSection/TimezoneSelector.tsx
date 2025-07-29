/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { InlineNotification, Stack, Toggle } from '@instana/carbon';

import TimezoneList from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/TimezoneList';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { getCurrentFormattedTimezone } from 'in-service-levels/utils/timezone';
import { utcLabel } from 'in-service-levels/constants';
import { t } from 'in-i18n';

import locals from './TimezoneSelector.mless';

export default function TimezoneSelector() {
  const { form, onChange } = useContext(SloFormContext);
  const bindTimezoneField = form.getIn(['objective', 'bindTimezone']);
  const timezoneField = form.getIn(['objective', 'timezone']);
  const isTimezoneSelected = bindTimezoneField.value && timezoneField.value && timezoneField.value !== utcLabel;

  const timezoneMessage = isTimezoneSelected
    ? t('in-service-levels:createSloDialog.selectedTimezoneMessage', { timezone: timezoneField.value })
    : t('in-service-levels:createSloDialog.currentTimezoneMessage', { timezone: getCurrentFormattedTimezone() });

  const handleTimezoneToggle = (toggleValue: boolean) => {
    if (!toggleValue) {
      onChange(['objective', 'timezone'], () => timezoneField.setValue(''));
    }
    onChange(['objective', 'bindTimezone'], () => bindTimezoneField.setValue(toggleValue));
  };

  return (
    <Stack orientation="vertical" gap={4}>
      <Toggle
        className={locals.toggleContainer}
        id="slo-objective-timezone-toggle"
        value={
          bindTimezoneField.value
            ? t('in-service-levels:createSloDialog.enabledToggleLabel')
            : t('in-service-levels:createSloDialog.disabledToggleLabel')
        }
        labelText={t('in-service-levels:createSloDialog.bindTimezoneLabel')}
        labelA={t('in-service-levels:createSloDialog.enabledToggleLabel')}
        labelB={t('in-service-levels:createSloDialog.disabledToggleLabel')}
        size="sm"
        onToggle={handleTimezoneToggle}
        toggled={bindTimezoneField.value}
      />
      <TimezoneList />
      <InlineNotification
        className={locals.notificationContainer}
        id="timezone-toast-notification"
        kind="info"
        hideCloseButton
        lowContrast
        subtitle={timezoneMessage}
      />
    </Stack>
  );
}
