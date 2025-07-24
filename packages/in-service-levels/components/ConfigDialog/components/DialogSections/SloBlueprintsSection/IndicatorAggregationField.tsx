/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import type { Field } from 'formalistic';
import React from 'react';

import { Stack, Typography, ValidationBlock } from '@instana/components';
import type { AggregationType } from '@instana/types';

import AggregationSelectorInput from 'in-service-levels/components/Shared/AggregationSelectorInput/AggregationSelectorInput';
import type { SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import type { TimeAggregationOptions } from 'in-service-levels/types';
import { timeAggregationOptions } from 'in-service-levels/constants';
import { isFieldValid } from 'in-service-levels/utils/form';
import { t } from 'in-i18n';

interface IndicatorAggregationFieldProps {
  availableOptions?: TimeAggregationOptions[];
  disabled?: boolean;
  field: Field<AggregationType>;
  onChange: SloFormOnChange;
}

const defaultAvailableOptions = Object.keys(timeAggregationOptions) as TimeAggregationOptions[];

export default function IndicatorAggregationField({
  availableOptions = defaultAvailableOptions,
  disabled = false,
  field,
  onChange
}: IndicatorAggregationFieldProps) {
  const isAggregationValid = isFieldValid(field);

  return (
    <Stack gap="xxsmall">
      <Typography variant="body-bold" component="p">
        {t('in-service-levels:general.aggregation')}
      </Typography>
      <AggregationSelectorInput
        availableOptions={availableOptions}
        disabled={disabled}
        hasError={!isAggregationValid}
        handleChange={({ target }) =>
          onChange(['indicator', 'aggregation'], () => field.setValue(target.value as AggregationType).setTouched(true))
        }
        value={field.value}
      />
      {!isAggregationValid &&
        field.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
    </Stack>
  );
}
