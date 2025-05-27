/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { RadioButton, RadioButtonGroup, NumberInput } from '@instana/carbon';
import { Stack, Typography, ValidationBlock } from '@instana/components';
import { SLIThresholdOperator } from '@instana/types';

import HeadlineFormSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/HeadlineFormSection';
import OperatorDropdown from 'in-service-levels/components/Shared/FormComponents/OperatorDropdown/OperatorDropdown';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { sliThresholdOperators } from 'in-service-levels/constants';
import { Trans, t } from 'in-i18n';

import locals from './AggregationAndThresholdFormSection.mless';

const operatorMapping: Record<SLIThresholdOperator, string> = { '>': 'GT', '>=': 'GTE', '<': 'LT', '<=': 'LTE' };

export default function SloIndicatorTrafficForm() {
  const { form, onChange, mode } = useContext(SloFormContext);

  const entityTypeField = form.getIn(['entity', 'type']);
  const operatorField = form.getIn(['indicator', 'operator']);
  const thresholdField = form.getIn(['indicator', 'threshold']);
  const trafficTypeField = form.getIn(['indicator', 'trafficType']);

  const isFormInEditMode = mode === 'EDIT';

  const isThresholdFieldValid = isFieldValid(thresholdField);

  return (
    <Stack gap="small">
      <HeadlineFormSection />
      <Typography variant="body-bold" component="h4" noMargin>
        {t('in-service-levels:general.threshold')}
      </Typography>
      <Typography variant="body-regular" component="p" noMargin>
        {t('in-service-levels:createSloDialog.indicatorSection.thresholdDescription', {
          entityType: entityTypeField.value,
          thresholdValue: thresholdField.value ?? 0,
          context: operatorMapping[operatorField.value]
        })}
      </Typography>
      <Stack direction="horizontal" align="center">
        <Trans
          i18nKey="in-service-levels:createSloDialog.indicatorSection.thresholdInput"
          values={{ entityType: entityTypeField.value, count: thresholdField.value ?? 0 }}
          components={{
            Stack: <Stack gap="small" />,
            HorizontalStack: <Stack direction="horizontal" align="center" gap="small" />,
            OperatorDropdown: (
              <OperatorDropdown
                operators={sliThresholdOperators}
                disabled={isFormInEditMode}
                value={operatorField.value}
                onChange={operator =>
                  onChange(['indicator', 'operator'], () => operatorField.setValue(operator).setTouched(true))
                }
              />
            ),
            ThresholdInput: (
              <NumberInput
                className={locals.thresholdInput}
                disabled={isFormInEditMode}
                invalid={!isThresholdFieldValid}
                id="threshold-traffic-input"
                min={0}
                allowEmpty
                size="sm"
                invalidText={''}
                iconDescription="Change threshold value"
                onChange={(_event, state) => {
                  const newValue = state.value === '' ? undefined : Number(state.value);
                  onChange(['indicator', 'threshold'], () => thresholdField.setValue(newValue).setTouched(true));
                }}
                onKeyDown={e => (e.key === '.' ? e.preventDefault() : null)}
                type="number"
                value={thresholdField.value ?? ''}
              />
            )
          }}
        />
      </Stack>

      {!isThresholdFieldValid &&
        thresholdField.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
      <Typography variant="body-bold" component="h4" noMargin>
        {t('in-service-levels:general.trafficType')}
      </Typography>
      <RadioButtonGroup orientation="vertical" name="slo-indicator-traffic">
        <RadioButton
          checked={trafficTypeField.value === 'all'}
          disabled={isFormInEditMode}
          labelText={t('in-service-levels:general.indicator.trafficTypeLabel', {
            entityType: entityTypeField.value,
            trafficType: 'all'
          })}
          onChange={() =>
            onChange(['indicator', 'trafficType'], () => trafficTypeField.setValue('all').setTouched(true))
          }
        />
        <RadioButton
          checked={trafficTypeField.value === 'erroneous'}
          disabled={isFormInEditMode}
          labelText={t('in-service-levels:general.indicator.trafficTypeLabel', {
            entityType: entityTypeField.value,
            trafficType: 'erroneous'
          })}
          onChange={() =>
            onChange(['indicator', 'trafficType'], () => trafficTypeField.setValue('erroneous').setTouched(true))
          }
        />
      </RadioButtonGroup>
    </Stack>
  );
}
