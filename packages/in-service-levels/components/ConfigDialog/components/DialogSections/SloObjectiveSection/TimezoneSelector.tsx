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
import { t } from 'in-i18n';

import locals from './TimezoneSelector.mless';

export default function TimezoneSelector() {
  const { form, onChange } = useContext(SloFormContext);
  const bindTimezoneField = form.getIn(['objective', 'bindTimezone']);
  const timezoneField = form.getIn(['objective', 'timezone']);
  const isTimezoneSelected = bindTimezoneField.value && timezoneField.value !== '';

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
    <div>
      <Stack orientation="horizontal" gap={6}>
        <Toggle
          id="slo-objective-timezone-toggle"
          value={bindTimezoneField.value ? 'enable' : 'disable'}
          labelText={t('in-service-levels:createSloDialog.bindTimezoneLabel')}
          labelA="enable"
          labelB="disable"
          size="sm"
          onToggle={handleTimezoneToggle}
          toggled={bindTimezoneField.value}
        />
        <Stack orientation="vertical" gap={4}>
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
      </Stack>
    </div>
  );
}
