/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import ThresholdValueFormGroupForMultiStaticThreshold from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForMultiStaticThreshold';
import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/MultiThresholdDeviationSliderForm';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { BluePrint as MobileAppBlueprint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { BluePrint as WebsiteBlueprint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/ThresholdTypeSelection';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

interface CustomEventsThresholdConditionProps {
  form: MapForm<any>;
  blueprintConfig: WebsiteBlueprint | MobileAppBlueprint;
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  eumType: string;
  getMetricUnitPostfix: (arg: string) => string;
  isPercentageMetric: (arg: string) => boolean;
}

export default function CustomEventsThresholdCondition({
  form,
  blueprintConfig,
  updateForm,
  editMode,
  eumType,
  getMetricUnitPostfix,
  isPercentageMetric
}: CustomEventsThresholdConditionProps) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdType = form.get('threshold').get('warningThreshold').get('type')?.value;
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  return (
    <>
      <ThresholdConditionFormGroup>
        <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />

        <ThresholdTypeSelection
          form={form}
          updateForm={updateForm}
          editMode={editMode}
          thresholdTypeOptions={thresholdTypeOptions}
          eumType={eumType}
        />
      </ThresholdConditionFormGroup>

      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdValueFormGroupForMultiStaticThreshold
          form={form}
          updateForm={updateForm}
          maxValue={maxValue}
          percentageMetric={percentageMetric}
          metricUnitPostfix={metricUnitPostfix}
          label={t('in-alerting:smartAlerts.eum.advanced.thresholdValue')}
        />
      )}
      {thresholdType !== STATIC_THRESHOLD && (
        <MultiThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
      )}
    </>
  );
}
