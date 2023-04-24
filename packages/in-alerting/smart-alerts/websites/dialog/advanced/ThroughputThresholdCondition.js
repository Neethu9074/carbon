/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/websites/dialog/advanced/ThresholdTypeSelection';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

export default function ThroughputThresholdCondition({ form, updateForm, blueprintConfig, editMode }) {
  const metricName = form.get('rule').get('metricName').value;
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <>
      <ThresholdConditionFormGroup>
        <Dropdown
          value={metricName}
          items={ruleMetricNameOptions.throughput}
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
        />
      </ThresholdConditionFormGroup>

      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdConditionFormGroup
          iconType="lib_threshold"
          label={t('in-alerting:smartAlerts.websites.advanced.thresholdValue')}
        >
          <ThresholdValueInputWithValidationMessage
            max={maxValue}
            form={form}
            updateForm={updateForm}
            metricUnitPostfix={metricUnitPostfix}
          />
          <UseSuggestedValueButton form={form} updateForm={updateForm} metricUnitPostfix={metricUnitPostfix} />
        </ThresholdConditionFormGroup>
      )}

      {thresholdType !== STATIC_THRESHOLD && (
        <ThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
      )}
    </>
  );
}

ThroughputThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
