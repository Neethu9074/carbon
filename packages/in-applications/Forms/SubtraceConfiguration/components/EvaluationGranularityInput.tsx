/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { FormLabel, RadioButton } from '@instana/components';
import { t } from '@instana/i18n-react';

import { minutes } from 'in-services/time/time';

import locals from 'in-applications/Forms/SubtraceConfiguration/components/EvaluationGranularityInput.mless';

interface EvaluationGranularityInputProps {
  value: number;
  onChangeGranularity: (granularity: number) => void;
}

export const EvaluationGranularityInput = ({ value, onChangeGranularity }: EvaluationGranularityInputProps) => {
  return (
    <>
      <FormLabel>{t('in-applications:subtraces.configuration.evaluationGranularity')}</FormLabel>
      <div className={locals.radioButtonGroup}>
        <RadioButton
          label={t('in-components:time.minutes', { count: 1 })}
          checked={value === minutes.toSeconds(1)}
          onChange={() => onChangeGranularity(minutes.toSeconds(1))}
        />
        <RadioButton
          label={t('in-components:time.minutes', { count: 5 })}
          checked={value === minutes.toSeconds(5)}
          onChange={() => onChangeGranularity(minutes.toSeconds(5))}
        />
        <RadioButton
          label={t('in-components:time.minutes', { count: 10 })}
          checked={value === minutes.toSeconds(10)}
          onChange={() => onChangeGranularity(minutes.toSeconds(10))}
        />
      </div>
    </>
  );
};
