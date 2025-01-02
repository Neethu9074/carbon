/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Dropdown } from '@instana/components';

import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { days, minutes, hours } from 'in-services/time/time';
import { t } from 'in-i18n';

export default function GracePeriod({
  form,
  updateForm
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}) {
  const gracePeriod = form.get('gracePeriod').value;
  const granularity = form.get('granularity').value;
  const gracePeriodOptions = generateGracePeriodOptions(granularity);
  const handleGracePeriodChange = (newValue: string) => {
    const updatedGracePeriod = parseInt(newValue, 10);
    updateForm(form.updateIn(['gracePeriod'], (f: Field<number>) => f.setValue(updatedGracePeriod).setTouched(true)));
  };

  return (
    <TearSheetStepContentWrapper
      headline={t('in-alerting:smartAlerts.components.tearSheet.gracePeriod.title')}
      description={t('in-alerting:smartAlerts.components.tearSheet.gracePeriod.description')}
    >
      <Dropdown
        items={gracePeriodOptions}
        value={gracePeriod.toString()}
        onChange={handleGracePeriodChange}
        size="sm"
      />
    </TearSheetStepContentWrapper>
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

export function generateGracePeriodOptions(granularityMillis: number): { value: string; label: string }[] {
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
