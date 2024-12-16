/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { RadioButton, Stack, Typography, ValidationBlock } from '@instana/components';
import { SLIThresholdOperator } from '@instana/types';

import HeadlineFormSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/HeadlineFormSection';
import OperatorDropdown from 'in-service-levels/components/Shared/FormComponents/OperatorDropdown/OperatorDropdown';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import ThresholdInput from 'in-service-levels/components/Shared/ThresholdInput/ThresholdInput';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { sliThresholdOperators } from 'in-service-levels/constants';
import { Trans, t } from 'in-i18n';

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
          thresholdValue: thresholdField.value ?? 0,
          context: operatorMapping[operatorField.value]
        })}
      </Typography>
      <Stack direction="horizontal" align="center">
        <Trans
          i18nKey="in-service-levels:createSloDialog.indicatorSection.thresholdInput"
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
              <ThresholdInput
                disabled={isFormInEditMode}
                hasError={!isThresholdFieldValid}
                handleChange={value =>
                  onChange(['indicator', 'threshold'], () => thresholdField.setValue(value).setTouched(true))
                }
                value={thresholdField.value}
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
      <Stack gap="disabled">
        <RadioButton
          checked={trafficTypeField.value === 'all'}
          disabled={isFormInEditMode}
          label={t('in-service-levels:general.indicator.trafficTypeLabel', {
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
          label={t('in-service-levels:general.indicator.trafficTypeLabel', {
            entityType: entityTypeField.value,
            trafficType: 'erroneous'
          })}
          onChange={() =>
            onChange(['indicator', 'trafficType'], () => trafficTypeField.setValue('erroneous').setTouched(true))
          }
        />
      </Stack>
    </Stack>
  );
}
