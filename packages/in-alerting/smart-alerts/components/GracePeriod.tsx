/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { CarbonDropdown } from '@instana/components';

import { formatDurationAccurately } from 'in-services/formatters/date';
import { days, minutes, hours } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/GracePeriod.mless';

type DropdownItem = { value: string; label: string };
interface GracePeriodProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function GracePeriod({ form, updateForm }: GracePeriodProps) {
  const gracePeriod = form.get('gracePeriod')?.value;
  const granularity = form?.get('granularity')?.value;
  const gracePeriodOptions: DropdownItem[] = generateGracePeriodOptions(granularity ?? 60000);

  const handleGracePeriodChange = (event: { selectedItem: DropdownItem }) => {
    const newValue = event.selectedItem.value;
    const updatedGracePeriod = parseInt(newValue, 10);
    updateForm(form.updateIn(['gracePeriod'], (f: Field<number>) => f.setValue(updatedGracePeriod).setTouched(true)));
  };

  return (
    <div className={locals.dropdownContainer}>
      <CarbonDropdown
        id="grace-period-dropdown"
        items={gracePeriodOptions}
        selectedItem={gracePeriodOptions.find(option => option.value === gracePeriod?.toString())}
        itemToString={item => (item ? item.label : '')}
        onChange={handleGracePeriodChange}
        size="sm"
        label={t('in-alerting:smartAlerts.components.gracePeriod.label')}
        titleText={t('in-alerting:smartAlerts.components.gracePeriod.description')}
      />
    </div>
  );
}

const predefinedPeriods = [
  minutes.toMillis(15),
  minutes.toMillis(30),
  hours.toMillis(1),
  hours.toMillis(3),
  hours.toMillis(6),
  hours.toMillis(12),
  days.toMillis(1),
  days.toMillis(2),
  days.toMillis(3),
  days.toMillis(7)
];

export function generateGracePeriodOptions(granularityMillis: number): DropdownItem[] {
  const granularityPeriods: number[] = [];
  for (let i = 1; i <= 10; i++) {
    granularityPeriods.push(i * granularityMillis);
  }

  const additionalPeriods = predefinedPeriods.filter(
    period => period > granularityPeriods[granularityPeriods.length - 1] && period % granularityMillis === 0
  );

  const allPeriods = [...granularityPeriods, ...additionalPeriods];

  return allPeriods.map(period => ({
    value: period.toString(),
    label: formatDurationAccurately(period, minutes.toMillis(1), false) as string
  }));
}
