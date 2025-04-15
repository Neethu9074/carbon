/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field } from 'formalistic';
import React from 'react';

import { Stack, Typography, ValidationBlock } from '@instana/components';

import { CustomBlueprintType, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import ThresholdInput from 'in-service-levels/components/Shared/ThresholdInput/ThresholdInput';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import PercentageInput from 'in-service-levels/components/PercentageInput';
import { t } from 'in-i18n';

interface IndicatorThresholdFieldProps {
  blueprint: CustomBlueprintType;
  disabled?: boolean;
  percentageValue?: boolean;
  field: Field<number | undefined>;
  onChange: SloFormOnChange;
}

export default function IndicatorThresholdField({
  blueprint,
  disabled = false,
  field,
  percentageValue,
  onChange
}: IndicatorThresholdFieldProps) {
  const isThresholdValid = isFieldValid(field);

  return (
    <Stack gap="xxsmall">
      <Typography variant="body-bold" component="p">
        {t('in-service-levels:createSloDialog.indicatorSection.thresholdLabel', { context: blueprint })}
      </Typography>
      {!percentageValue && (
        <ThresholdInput
          disabled={disabled}
          hasError={!isThresholdValid}
          handleChange={value => onChange(['indicator', 'threshold'], () => field.setValue(value).setTouched(true))}
          value={field.value}
        />
      )}
      {percentageValue && (
        <PercentageInput
          id="slo-threshold"
          value={field.value}
          onChange={value => onChange(['indicator', 'threshold'], () => field.setValue(value).setTouched(true))}
          hasError={!isThresholdValid}
          disabled={disabled}
          decimalPrecision={2}
        />
      )}
      {!isThresholdValid &&
        field.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
    </Stack>
  );
}
