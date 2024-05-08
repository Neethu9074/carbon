/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field } from 'formalistic';
import React from 'react';

import { Stack, Typography } from '@instana/components';

import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import Input from 'in-components/form/Input/Input';

import locals from './ThresholdCondition.mless';

interface ThresholdConditionProps {
  type: string;
  field: Field<any>;
  operator: string;
  label: string;
  unit: string;
  onChange: any;
}

export default function ThresholdCondition({ type, label, field, operator, onChange, unit }: ThresholdConditionProps) {
  return (
    <ThresholdConditionFormGroup shouldIncreaseColumns label={label}>
      <div className={locals.condition}>
        <Stack direction="horizontal" distribution="spaceBetween">
          <Stack direction="horizontal" align="center" gap="disabled">
            <Typography variant="body-small">
              <div className={locals.operator}>{operator}</div>
            </Typography>
            <Input
              className={locals.warning}
              value={field?.value}
              hasError={!field?.valid && field?.touched}
              onChange={({ target }) => {
                onChange(['threshold', type], (field: Field<string>) =>
                  (field as Field<string>).setValue(target.value).setTouched(true)
                );
              }}
              maxLength={128}
            />
            <Typography variant="body-small">{unit}</Typography>
          </Stack>
          <div className={type === 'critical' ? locals.criticalColor : locals.warningColor} />
        </Stack>
      </div>
    </ThresholdConditionFormGroup>
  );
}
