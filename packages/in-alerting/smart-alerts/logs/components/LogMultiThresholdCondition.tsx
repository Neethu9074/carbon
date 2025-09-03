/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { ThresholdType } from '@instana/types/typeDefinitions';

import ThresholdValueFormGroupForMultiStaticThreshold from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForMultiStaticThreshold';
import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/MultiThresholdDeviationSliderForm';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { getMaxMetricValue } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import ThresholdLabel from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdLabel';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/logs/form/thresholdForm';
import { logSmartAlertsAdaptiveBaselineEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

interface LogMultiThresholdConditionProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric: boolean;
  metricUnitPostfix: string;
  groupBy?: string[];
}

type SupportedThresholdType = typeof STATIC_THRESHOLD | typeof ADAPTIVE_BASELINE;

export default function LogMultiThresholdCondition({
  form,
  updateForm,
  percentageMetric,
  metricUnitPostfix,
  groupBy
}: LogMultiThresholdConditionProps) {
  const maxValue = getMaxMetricValue(percentageMetric);
  const thresholdType = (form.get('threshold').get('warningThreshold').get('type') as Field<ThresholdType>).value;
  const showSuggestedValueButton = logSmartAlertsAdaptiveBaselineEnabled && !groupBy?.length;
  const thresholdTypeLabel =
    thresholdType === STATIC_THRESHOLD
      ? t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')
      : t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionAdaptiveBaseline');

  const supportedThresholdType = thresholdType as SupportedThresholdType;

  const thresholdComponentMap: Partial<Record<SupportedThresholdType, React.ReactNode>> = {
    [STATIC_THRESHOLD]: (
      <ThresholdValueFormGroupForMultiStaticThreshold
        form={form}
        updateForm={updateForm}
        maxValue={maxValue}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric={percentageMetric}
        label={t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold')}
        showSuggestedValueButton={showSuggestedValueButton}
      />
    ),
    [ADAPTIVE_BASELINE]: (
      <MultiThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
    )
  };

  const thresholdComponent = thresholdComponentMap[supportedThresholdType];

  return (
    <div>
      <ThresholdConditionFormGroup>
        <ThresholdOperatorDropDown
          form={form}
          updateForm={updateForm}
          customOnChange={newOperator => {
            updateForm(
              form.updateIn(['threshold', 'operator'], f => (f as Field<any>).setValue(newOperator).setTouched(true))
            );
          }}
          allOptions
        />
        <ThresholdLabel>{thresholdTypeLabel}</ThresholdLabel>
      </ThresholdConditionFormGroup>

      {thresholdComponent}
    </div>
  );
}
