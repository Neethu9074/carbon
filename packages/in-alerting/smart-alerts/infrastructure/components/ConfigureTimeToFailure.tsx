/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

import { PredictiveTrigger } from '@instana/types';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { t } from 'in-i18n';

const MAX_STEPS_AHEAD = 10;

export interface ConfigureTimeToFailureProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
}
export default function ConfigureTimeToFailure({ form, updateForm }: ConfigureTimeToFailureProps) {
  const granularity = form.get('granularity').value;
  const predictiveTriggerField = form.get('predictiveTrigger') as Field<PredictiveTrigger | null>;
  const timeToFailure = predictiveTriggerField.value?.timeToFailure ?? 0;

  const handleTimeToFailureChange = (optionValue: number) => {
    if (!updateForm) {
      return;
    }

    const predictiveTriggerValue =
      optionValue === 0
        ? null
        : ({
            timeToFailure: optionValue * granularity
          } as PredictiveTrigger);

    updateForm(
      form.updateIn(['predictiveTrigger'], f =>
        (f as Field<PredictiveTrigger | null>).setValue(predictiveTriggerValue).setTouched(true)
      )
    );
  };

  const options = getOptions(granularity);
  const selectedOption = timeToFailure / granularity;
  return (
    <SelectInSection
      label={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.timeToFailure')}
      id="metric-configurator-infra-aggregation"
      value={selectedOption}
      onChange={e => handleTimeToFailureChange(Number(e.target.value))}
    >
      <>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </>
    </SelectInSection>
  );
}

interface Option {
  value: number;
  label: string;
}

function getOptions(granularity: number) {
  const options: Option[] = [];
  options.push({
    value: 0,
    label: 'Disabled'
  });
  for (let i = 1; i <= MAX_STEPS_AHEAD; ++i) {
    options.push({
      value: i,
      label: formatDurationAccurately(i * granularity, 60000, false) ?? ''
    });
  }
  return options;
}
