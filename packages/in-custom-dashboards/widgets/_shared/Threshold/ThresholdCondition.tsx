/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field } from 'formalistic';
import React from 'react';

import { Spacer, Stack, Typography } from '@instana/components';
import { ThresholdOperator } from '@instana/types';

import {
  getUnit,
  shouldDisplayConvertedUnits
} from 'in-custom-dashboards/widgets/_shared/Threshold/thresholdUnitUtils';
import ThresholdConditionFormGroup from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdConditionFormGroup';
import { humanReadableThresholdOperator } from 'in-components/Threshold/threshold';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { getFormatterById } from 'in-stores/metric/formatters';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from './ThresholdCondition.mless';

interface ThresholdConditionProps {
  type: 'warning' | 'critical';
  operator: ThresholdOperator;
  label: string;
  hasError: boolean;
  field: Field<string>;
  change: (newValue: string) => void;
  formatterId: string;
}

export default function ThresholdCondition({
  type,
  label,
  field,
  operator,
  change,
  hasError,
  formatterId
}: ThresholdConditionProps) {
  const formatter = getFormatterById(formatterId);
  // 1 represents the base value used to get the unit from
  const unit = getUnit(formatter?.formatter(1));
  const formattedValue = field?.value === '' ? undefined : formatter?.formatter(parseFloat(field?.value));
  const displayFormattedWithUnit =
    formatter?.unitConversion && formattedValue && shouldDisplayConvertedUnits(formattedValue);
  return (
    <ThresholdConditionFormGroup label={label}>
      <div className={locals.condition}>
        <Stack direction="horizontal" distribution="spaceBetween">
          <Stack direction="horizontal" align="center" gap="disabled">
            <Typography variant="body-small">
              <div className={locals.operator}>{humanReadableThresholdOperator.get(operator)}</div>
            </Typography>
            <Input
              id={`${type}-field`}
              className={locals[type]}
              value={field?.value}
              hasError={(!field?.valid && field?.touched) || hasError}
              onChange={({ target: { value } }) => change(value)}
              type="number"
              step={0.01}
              min="0"
            />
            <TouchedMessages field={field} />
            <Typography variant="body-small">
              {unit === 'B' ? t('in-custom-dashboards:widgets.bigNumber.thresholdForm.bytes') : unit}
            </Typography>
            {displayFormattedWithUnit && (
              <>
                <Spacer horizontal="normal" />
                <Typography variant="body-small">({formattedValue})</Typography>
              </>
            )}
          </Stack>
          <Stack align="center" direction="horizontal" gap="disabled">
            <div className={locals[`${type}Color`]} />
          </Stack>
        </Stack>
      </div>
    </ThresholdConditionFormGroup>
  );
}
