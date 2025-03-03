/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { AlertingDurationUnitType } from '@instana/types';
import { Dropdown } from '@instana/components';

import { SloAlertDurationUnitTypes } from 'in-alerting/smart-alerts/slo/types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/slo/components/TimeOptionsDropdown.mless';

export const SLO_DURATION_OPTIONS: SloAlertDurationUnitTypes[] = ['minute', 'hour', 'day'];

const DROPDOWN_DURATION_ITEMS = SLO_DURATION_OPTIONS.map(durationOption => ({
  label: t('in-alerting:smartAlerts.slo.components.timeOptionsDropdown', {
    context: durationOption
  }),
  value: durationOption
}));

interface TimeWindowValueInputProps {
  value: AlertingDurationUnitType;
  onChange: (operator: SloAlertDurationUnitTypes) => void;
}

export default function TimeOptionsDropdown({ value, onChange }: TimeWindowValueInputProps) {
  if (!isSloAlertDurationUnit(value)) throw Error('Unsupported duration unit');

  return (
    <div className={locals.dropdownContainer}>
      <Dropdown
        items={DROPDOWN_DURATION_ITEMS}
        value={value}
        onChange={(option: SloAlertDurationUnitTypes) => {
          onChange(option);
        }}
      />
    </div>
  );
}

export function isSloAlertDurationUnit(durationUnit: string): durationUnit is SloAlertDurationUnitTypes {
  return SLO_DURATION_OPTIONS.includes(durationUnit as SloAlertDurationUnitTypes);
}
