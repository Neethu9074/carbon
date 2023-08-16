/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, Typography } from '@instana/components';
import { AggregationType } from '@instana/types';

import AggregationSelectorInput from 'in-service-levels/components/Shared/AggregationSelectorInput/AggregationSelectorInput';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import ThresholdInput from 'in-service-levels/components/Shared/ThresholdInput/ThresholdInput';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { t } from 'in-i18n';

import locals from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/AggregationAndThresholdFormSection.mless';

export default function AggregationAndThresholdFormSection() {
  const { form, onChange } = useContext(SloFormContext);

  const aggregationField = form.getIn(['indicator', 'aggregation']);
  const blueprintField = form.getIn(['indicator', 'blueprint']);
  const thresholdField = form.getIn(['indicator', 'threshold']);

  const doesAggregationHaveError = !aggregationField.valid && (aggregationField.touched || form.touched);
  const doesThresholdHaveError = !thresholdField.valid && (thresholdField.touched || form.touched);

  return (
    <div className={locals.grid}>
      <Stack gap="xxsmall">
        <Typography variant="body-bold" component="p">
          {t('in-service-levels:general.aggregation')}
        </Typography>
        <AggregationSelectorInput
          value={aggregationField.value}
          hasError={doesAggregationHaveError}
          handleChange={({ target }) =>
            onChange(['indicator', 'aggregation'], () =>
              aggregationField.setValue(target.value as AggregationType).setTouched(true)
            )
          }
        />
        {doesAggregationHaveError &&
          aggregationField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
      </Stack>
      <Stack gap="xxsmall">
        <Typography variant="body-bold" component="p">
          {t('in-service-levels:createSloDialog.indicatorSection.thresholdLabel', {
            context: blueprintField.value
          })}
        </Typography>
        <ThresholdInput
          value={thresholdField.value}
          hasError={doesThresholdHaveError}
          handleChange={value =>
            onChange(['indicator', 'threshold'], () => thresholdField.setValue(value).setTouched(true))
          }
        />
        {doesThresholdHaveError &&
          thresholdField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
      </Stack>
    </div>
  );
}
