/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import PropTypes from 'prop-types';
import React from 'react';

import ThresholdValueFormGroupForMultiStaticThreshold from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForMultiStaticThreshold';
import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/MultiThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/ThresholdTypeSelection';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

export default function ThroughputThresholdCondition({
  form,
  updateForm,
  blueprintConfig,
  editMode,
  eumType,
  ruleMetricNameOptions,
  getMetricUnitPostfix
}) {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <>
      <ThresholdConditionFormGroup>
        <Dropdown
          value={metricName}
          items={ruleMetricNameOptions.throughput}
          className={locals.dropdownmd}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));
          }}
        />
        <ThresholdOperatorDropDown
          form={form}
          customOnChange={newOperator => {
            updateForm(form.updateIn(['threshold', 'operator'], f => f.setValue(newOperator).setTouched(true)));
          }}
          allOptions
        />

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
          metricUnitPostfix={metricUnitPostfix}
          isGlobalSmartAlert={false}
        />
      )}
      {thresholdType !== STATIC_THRESHOLD && (
        <MultiThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
      )}
    </>
  );
}

ThroughputThresholdCondition.propTypes = {
  blueprintConfig: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  eumType: PropTypes.string.isRequired,
  ruleMetricNameOptions: PropTypes.object.isRequired,
  getMetricUnitPostfix: PropTypes.func.isRequired
};
