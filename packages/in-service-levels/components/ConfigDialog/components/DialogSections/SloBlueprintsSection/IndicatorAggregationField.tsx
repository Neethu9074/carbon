/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field } from 'formalistic';
import React from 'react';

import { Stack, Typography } from '@instana/components';
import { AggregationType } from '@instana/types';

import AggregationSelectorInput from 'in-service-levels/components/Shared/AggregationSelectorInput/AggregationSelectorInput';
import { SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { t } from 'in-i18n';

interface IndicatorAggregationFieldProps {
  field: Field<AggregationType>;
  onChange: SloFormOnChange;
}

export default function IndicatorAggregationField({ field, onChange }: IndicatorAggregationFieldProps) {
  const isAggregationValid = isFieldValid(field);

  return (
    <Stack gap="xxsmall">
      <Typography variant="body-bold" component="p">
        {t('in-service-levels:general.aggregation')}
      </Typography>
      <AggregationSelectorInput
        value={field.value}
        hasError={!isAggregationValid}
        handleChange={({ target }) =>
          onChange(['indicator', 'aggregation'], () => field.setValue(target.value as AggregationType).setTouched(true))
        }
      />
      {!isAggregationValid &&
        field.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
    </Stack>
  );
}
