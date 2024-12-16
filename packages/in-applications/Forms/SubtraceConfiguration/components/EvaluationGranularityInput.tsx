/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonRadioButton, CarbonRadioButtonGroup } from '@instana/components';
import { t } from '@instana/i18n-react';

import { minutes } from 'in-services/time/time';

interface EvaluationGranularityInputProps {
  evaluationGranularity?: number;
  onChangeGranularity: (granularity: number) => void;
}

export const EvaluationGranularityInput = ({
  evaluationGranularity,
  onChangeGranularity
}: EvaluationGranularityInputProps) => {
  return (
    <CarbonRadioButtonGroup
      name="evaluation-granularity-radio-button-group"
      legendText={t('in-applications:subtraces.configuration.evaluationGranularity')}
      orientation="vertical"
      defaultSelected={evaluationGranularity}
      valueSelected={evaluationGranularity}
      onChange={value => onChangeGranularity(value as number)}
    >
      <CarbonRadioButton labelText={t('in-components:time.minutes', { count: 1 })} value={minutes.toSeconds(1)} />
      <CarbonRadioButton labelText={t('in-components:time.minutes', { count: 5 })} value={minutes.toSeconds(5)} />
      <CarbonRadioButton labelText={t('in-components:time.minutes', { count: 10 })} value={minutes.toSeconds(10)} />
    </CarbonRadioButtonGroup>
  );
};
