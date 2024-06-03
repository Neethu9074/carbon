/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field } from 'formalistic';
import React from 'react';

import { Spacer, Stack, Typography } from '@instana/components';
import { ThresholdOperator } from '@instana/types';

import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { metricConfigurationPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from './ThresholdCondition.mless';

interface ThresholdConditionProps {
  type: string;
  operator: ThresholdOperator;
  label: string;
  unit: string;
  hasError: boolean;
  formattedValue?: string | null;
  displayConvertedUnits: boolean;
  field: Field<string>;
  onChange: (path: string[], updater: (item: Field<string | boolean>) => Field<string | boolean>) => void;
}

export default function ThresholdCondition({
  type,
  label,
  field,
  operator,
  onChange,
  formattedValue,
  unit,
  hasError,
  displayConvertedUnits
}: ThresholdConditionProps) {
  return (
    <ThresholdConditionFormGroup shouldIncreaseColumns label={label}>
      <div className={locals.condition}>
        <Stack direction="horizontal" distribution="spaceBetween">
          <Stack direction="horizontal" align="center" gap="disabled">
            <Typography variant="body-small">
              <div className={locals.operator}>{humanReadableThresholdOperator(operator)}</div>
            </Typography>
            <Input
              id={`${type}-field`}
              className={type === 'warning' ? locals.warning : locals.critical}
              value={field?.value}
              hasError={(!field?.valid && field?.touched) || hasError}
              onChange={({ target }) => {
                onChange([metricConfigurationPath, 'threshold', type], field =>
                  (field as Field<string>).setValue(target.value).setTouched(true)
                );
              }}
              type="number"
              min="0"
            />
            <TouchedMessages field={field} />
            <Typography variant="body-small">
              {unit === 'B' ? t('in-custom-dashboards:widgets.bigNumber.thresholdForm.bytes') : unit}
            </Typography>
            {displayConvertedUnits && (
              <>
                <Spacer horizontal="normal" />
                <Typography variant="body-small">({formattedValue})</Typography>
              </>
            )}
          </Stack>
          <Stack align="center" direction="horizontal" gap="disabled">
            <div className={type === 'critical' ? locals.criticalColor : locals.warningColor} />
          </Stack>
        </Stack>
      </div>
    </ThresholdConditionFormGroup>
  );
}
