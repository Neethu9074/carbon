/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForStaticThreshold';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { BluePrint as MobileAppBlueprint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/ThresholdTypeSelection';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

interface CrashThresholdConditionProps {
  form: MapForm<any>;
  blueprintConfig: MobileAppBlueprint;
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  getMetricUnitPostfix: (arg: string) => string;
  isPercentageMetric: (arg: string) => boolean;
}

export default function CrashThresholdCondition({
  form,
  blueprintConfig,
  updateForm,
  editMode,
  getMetricUnitPostfix,
  isPercentageMetric
}: CrashThresholdConditionProps) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdType = form.get('threshold').get('type')?.value;
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();

  return (
    <>
      <ThresholdConditionFormGroup>
        <Dropdown
          value={metricName}
          items={ruleMetricNameOptions.crash}
          className={locals.dropdownxxlg}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'metricName'], f => (f as Field<any>).setValue(value).setTouched(true)));
          }}
        />
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />

        <ThresholdTypeSelection
          form={form}
          updateForm={updateForm}
          editMode={editMode}
          thresholdTypeOptions={thresholdTypeOptions}
          eumType={mobileAppEum}
        />
      </ThresholdConditionFormGroup>

      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdValueFormGroupForStaticThreshold
          form={form}
          updateForm={updateForm}
          maxValue={maxValue}
          metricUnitPostfix={metricUnitPostfix}
          percentageMetric={percentageMetric}
        />
      )}

      {thresholdType !== STATIC_THRESHOLD && (
        <ThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
      )}
    </>
  );
}
