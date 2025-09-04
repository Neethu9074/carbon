/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { InfraAlertEvaluationType, ThresholdType } from '@instana/types/typeDefinitions';

import ThresholdValueFormGroupForMultiStaticThreshold from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForMultiStaticThreshold';
import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/MultiThresholdDeviationSliderForm';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { getMaxMetricValue } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/infrastructure/form/thresholdForm';
import ThresholdLabel from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdLabel';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

interface InfraMultiThresholdConditionProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric: boolean;
  metricUnitPostfix: string;
  groupBy?: any;
}

export default function InfraMultiThresholdCondition({
  form,
  updateForm,
  percentageMetric,
  metricUnitPostfix,
  groupBy
}: InfraMultiThresholdConditionProps) {
  const maxValue = getMaxMetricValue(percentageMetric);
  const evaluationType = (form.get('evaluationType') as Field<InfraAlertEvaluationType>).value;
  const isPerEntityEvaluation = evaluationType === 'PER_ENTITY';

  const metricSelected = form.get('rule').get('metricName')?.value;
  const showSuggestedValueButton = !isPerEntityEvaluation && !groupBy?.length && metricSelected;
  const thresholdType = (form.get('threshold').get('warningThreshold').get('type') as Field<ThresholdType>).value;
  const thresholdTypeLabel =
    thresholdType === STATIC_THRESHOLD
      ? t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')
      : t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionAdaptiveBaseline');

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

      {thresholdType === STATIC_THRESHOLD ? (
        <ThresholdValueFormGroupForMultiStaticThreshold
          form={form}
          updateForm={updateForm}
          maxValue={maxValue}
          metricUnitPostfix={metricUnitPostfix}
          percentageMetric={percentageMetric}
          label={t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold')}
          showSuggestedValueButton={showSuggestedValueButton}
        />
      ) : (
        <MultiThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
      )}
    </div>
  );
}
