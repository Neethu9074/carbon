/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';
import { Stack } from '@instana/components';

import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/tearsheet/components/ThresholdFields.mless';

export default function ThresholdFields({
  form,
  updateForm,
  percentageMetric,
  metricUnitPostfix
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric: boolean;
  metricUnitPostfix: string;
}) {
  const maxValue = Number.MAX_SAFE_INTEGER;

  return (
    <Stack direction="horizontal">
      <div className={locals.smallDropDown}>
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
      </div>

      <Stack direction="horizontal" align="center">
        <ThresholdValueInputWithValidationMessage
          max={maxValue}
          form={form}
          updateForm={updateForm}
          percentageMetric={percentageMetric}
          metricUnitPostfix={metricUnitPostfix}
        />
        <Tooltip
          align="bottomMiddle"
          content={t('in-alerting:smartAlerts.logs.advancedModeContainer.threshold.tooltipText')}
        >
          <SvgIcon type="lib_help_error_info_outline" size="s" color={themes.default.ids.color.option.neutral['700']} />
        </Tooltip>
      </Stack>
    </Stack>
  );
}
